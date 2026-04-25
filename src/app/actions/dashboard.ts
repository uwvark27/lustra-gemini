'use server';

import { db } from '@/db';
import { entities } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function getBirthdaysForDate(month: number, day: number) {
  const birthdays = await db
    .select()
    .from(entities)
    .where(
      sql`MONTH(${entities.birthday}) = ${month} AND DAY(${entities.birthday}) = ${day}`
    );
  return birthdays;
}

export async function getDeathdaysForDate(month: number, day: number) {
  const deathdays = await db
    .select()
    .from(entities)
    .where(
      sql`MONTH(${entities.deathday}) = ${month} AND DAY(${entities.deathday}) = ${day}`
    );
  return deathdays;
}