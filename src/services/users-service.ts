import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const registerUser = async (name: string, email: string, password: string): Promise<void> => {
  // 1. Cek apakah email sudah terdaftar
  const existingUser = await db.select().from(users).where(eq(users.email, email));

  if (existingUser.length > 0) {
    throw new Error('Email sudah terdaftar');
  }

  // 2. Hash password (salt rounds = 10)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Simpan user baru ke database
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });
};
