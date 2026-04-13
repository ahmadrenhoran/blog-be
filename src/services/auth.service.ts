import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../models/user.model";
import { eq } from "drizzle-orm";
import { AppError } from "../utils/errors";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (
  name: string,
  email: string,
  passwordRaw: string,
) => {

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (existingUser)
    throw new AppError("Email has registered!", 400, "USER_IS_EXISTED");

  const hashedPassword = await bcrypt.hash(passwordRaw, 10);

  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id, name: users.name, email: users.email });

  return newUser;
};

export const loginUser = async (email: string, passwordRaw: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) throw new AppError("Email or password is invalid!", 400, "INVALID_CREDENTIALS");

  const isMatch = await bcrypt.compare(passwordRaw, user.password);
  if (!isMatch) throw new AppError("Email or password is invalid!", 400, "INVALID_CREDENTIALS");

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d",
  });

  return { user: { id: user.id, name: user.name, email: user.email }, token };
};
