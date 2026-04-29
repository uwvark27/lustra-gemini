'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { users, roles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';

export async function getProfileData() {
  const session = await auth();
  if (!session?.user) return null;

  const userId = parseInt(session.user.id ?? '', 10);

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      roleId: users.roleId,
      roleName: roles.name,
      entityId: users.entityId,
      avatarUrl: users.avatarUrl,
      createdAt: users.createdAt,
    })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, userId))
    .limit(1);

  const user = rows[0];
  if (!user) return null;

  return { user, role: (session.user as any).role as string };
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { success: false, error: 'Not authenticated' };

  const userId = parseInt(session.user.id ?? '', 10);
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const avatarFile = formData.get('avatar') as File | null;

  let avatarUrl: string | undefined;

  if (avatarFile && avatarFile.size > 0) {
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars');
    await mkdir(uploadDir, { recursive: true });
    const ext = extname(avatarFile.name) || '.jpg';
    const filename = `${userId}_avatar${ext}`;
    const buffer = Buffer.from(await avatarFile.arrayBuffer());
    await writeFile(join(uploadDir, filename), buffer);
    avatarUrl = `/uploads/avatars/${filename}`;
  }

  const updateData: Partial<{ name: string; email: string; avatarUrl: string }> = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (avatarUrl) updateData.avatarUrl = avatarUrl;

  if (Object.keys(updateData).length > 0) {
    await db.update(users).set(updateData).where(eq(users.id, userId));
  }

  // Revalidate so server components (layout, profile page) re-render with fresh DB data.
  // The toolbar avatar/name/email will fully reflect after next login when the JWT is re-issued.
  revalidatePath('/', 'layout');
  revalidatePath('/profile');

  return { success: true, avatarUrl };
}

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { success: false, error: 'Not authenticated' };

  const userId = parseInt(session.user.id ?? '', 10);
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!currentPassword || !newPassword) {
    return { success: false, error: 'All password fields are required.' };
  }

  const rows = await db
    .select({ password: users.password })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const user = rows[0];
  if (!user?.password) return { success: false, error: 'User not found.' };

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) return { success: false, error: 'Current password is incorrect.' };

  const hashed = await bcrypt.hash(newPassword, 12);
  await db.update(users).set({ password: hashed }).where(eq(users.id, userId));

  return { success: true };
}
