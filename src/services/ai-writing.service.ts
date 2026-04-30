import { sql } from "drizzle-orm";
import { db } from "../db";
import { AppError } from "../utils/errors";
import { GenerateWritingPayload, AIWritingAction } from "../schemas/ai-writing.schema";

interface OpenRouterChoice {
  message?: {
    content?: string;
  };
}

interface OpenRouterResponse {
  model?: string;
  choices?: OpenRouterChoice[];
  error?: {
    message?: string;
    code?: number | string;
  };
  message?: string;
}

const defaultModel = process.env.OPENROUTER_MODEL || process.env.VITE_OPENROUTER_MODEL || "openrouter/free";
const configuredDailyLimit = Number(process.env.AI_WRITING_DAILY_LIMIT || 10);
const dailyLimit = Number.isFinite(configuredDailyLimit) && configuredDailyLimit > 0
  ? configuredDailyLimit
  : 10;
const limitTimezone = process.env.AI_WRITING_LIMIT_TIMEZONE || "Asia/Jakarta";

const actionInstructions: Record<AIWritingAction, string> = {
  title: "Buat 7 opsi judul blog yang kuat, spesifik, dan mudah dibaca. Beri nomor.",
  outline: "Buat outline artikel yang rapi dengan pembuka, isi utama, dan penutup. Gunakan heading dan bullet points.",
  draft: "Tulis draft blog lengkap dalam Bahasa Indonesia yang enak dibaca, terstruktur, dan siap diedit lebih lanjut.",
  improve: "Perbaiki tulisan yang sudah ada agar lebih jelas, lebih mengalir, dan lebih bernilai tanpa mengubah inti pembahasan.",
  cta: "Buat beberapa opsi penutup dan call-to-action yang terasa natural, tidak hard-selling, dan cocok untuk blog.",
};

const getToday = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: limitTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

const buildPrompt = (payload: GenerateWritingPayload) => {
  const sections = [
    "Kamu adalah editor dan ghostwriter blog senior. Fokus pada kejelasan, struktur, ritme baca, dan kualitas ide.",
    `Tugas: ${actionInstructions[payload.action]}`,
    "Aturan output:",
    "- Gunakan Bahasa Indonesia yang natural dan rapi.",
    "- Jangan gunakan code fence.",
    '- Kembalikan hasil final saja tanpa pembuka tambahan seperti "Berikut hasilnya".',
    "- Jika membuat struktur, gunakan heading sederhana (#, ##) dan bullet list biasa.",
  ];

  if (payload.title?.trim()) {
    sections.push(`Judul saat ini:\n${payload.title.trim()}`);
  }

  if (payload.content?.trim()) {
    sections.push(`Konten saat ini:\n${payload.content.trim()}`);
  }

  if (payload.prompt.trim()) {
    sections.push(`Arahan penulis:\n${payload.prompt.trim()}`);
  }

  return sections.join("\n\n");
};

const reserveDailyUsage = async (userId: number) => {
  const today = getToday();

  const result = await db.execute(sql`
    insert into ai_generation_usages (user_id, usage_date, count)
    values (${userId}, ${today}, 1)
    on conflict (user_id, usage_date)
    do update set
      count = ai_generation_usages.count + 1,
      updated_at = now()
    where ai_generation_usages.count < ${dailyLimit}
    returning count
  `);

  const count = Number(result.rows[0]?.count || 0);

  if (!count) {
    throw new AppError(
      `Limit generate AI harian sudah tercapai (${dailyLimit} kali per hari).`,
      429,
      "AI_DAILY_LIMIT_REACHED",
    );
  }

  return {
    date: today,
    used: count,
    remaining: Math.max(dailyLimit - count, 0),
    limit: dailyLimit,
  };
};

const releaseDailyUsage = async (userId: number, usageDate: string) => {
  await db.execute(sql`
    update ai_generation_usages
    set count = greatest(count - 1, 0), updated_at = now()
    where user_id = ${userId} and usage_date = ${usageDate}
  `);
};

const normalizeOpenRouterError = (status: number, data: OpenRouterResponse) => {
  const detail = data.error?.message || data.message;

  if (detail) {
    return detail;
  }

  if (status === 401) {
    return "OpenRouter API key tidak valid atau belum diisi.";
  }

  if (status === 429) {
    return "Limit model gratis OpenRouter sedang tercapai. Coba lagi beberapa saat.";
  }

  return "Gagal menghubungi OpenRouter.";
};

export const generateWritingAssistance = async (
  userId: number,
  payload: GenerateWritingPayload,
) => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new AppError(
      "OPENROUTER_API_KEY belum diatur. Tambahkan API key OpenRouter di file .env.",
      500,
      "OPENROUTER_KEY_MISSING",
    );
  }

  const usage = await reserveDailyUsage(userId);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost",
        "X-Title": process.env.OPENROUTER_APP_NAME || "Blog CMS AI Writer",
      },
      body: JSON.stringify({
        model: defaultModel,
        messages: [
          {
            role: "user",
            content: buildPrompt(payload),
          },
        ],
      }),
      signal: AbortSignal.timeout(45000),
    });

    const data = (await response.json()) as OpenRouterResponse;

    if (!response.ok) {
      throw new AppError(
        normalizeOpenRouterError(response.status, data),
        response.status,
        "OPENROUTER_ERROR",
      );
    }

    const text = data.choices?.[0]?.message?.content?.trim() || "";

    if (!text) {
      throw new AppError("AI tidak mengembalikan teks yang bisa dipakai.", 502, "AI_EMPTY_RESPONSE");
    }

    return {
      model: data.model || defaultModel,
      text,
      usage,
    };
  } catch (error) {
    await releaseDailyUsage(userId, usage.date);
    throw error;
  }
};
