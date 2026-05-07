import { db } from "./db";
import { tools } from "./models";

const initialTools = [
  { name: 'Vue.js', slug: 'vuejs', category: 'Frontend', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
  { name: 'React', slug: 'react', category: 'Frontend', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'TypeScript', slug: 'typescript', category: 'Language', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'Tailwind CSS', slug: 'tailwindcss', category: 'CSS', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Node.js', slug: 'nodejs', category: 'Backend', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'PostgreSQL', slug: 'postgresql', category: 'Database', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'Figma', slug: 'figma', category: 'Design', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  { name: 'Adobe Photoshop', slug: 'photoshop', category: 'Design', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg' },
  { name: 'Laravel', slug: 'laravel', category: 'Backend', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg' },
  { name: 'Python', slug: 'python', category: 'Language', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Go', slug: 'go', category: 'Language', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
  { name: 'Docker', slug: 'docker', category: 'DevOps', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
];

async function seed() {
  console.log('🌱 Seeding tools...');
  try {
    for (const tool of initialTools) {
      await db.insert(tools).values(tool).onConflictDoUpdate({
        target: tools.slug,
        set: { icon_url: tool.icon_url, category: tool.category }
      });
    }
    console.log('✅ Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    process.exit(0);
  }
}

seed();
