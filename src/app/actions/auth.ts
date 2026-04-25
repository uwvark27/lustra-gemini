'use server';

import { signIn, signOut } from '@/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
  try {
    await signIn('credentials', { 
      ...Object.fromEntries(formData),
      redirectTo: '/'
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid email or password.' };
    }
    // Next.js uses internal errors to trigger redirects; we must throw them!
    throw error; 
  }
}

export async function register(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'All fields are required.' };
  }

  // Check if user already exists
  const existingUser = await db.select().from(users).where(eq(users.email, email));
  if (existingUser.length > 0) {
    return { error: 'This email is already in use.' };
  }

  // Hash the password securely
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user into MariaDB
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  redirect('/login');
}

export async function logout() {
  await signOut({ redirectTo: '/' });
}
