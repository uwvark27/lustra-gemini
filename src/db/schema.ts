import { mysqlTable, varchar, timestamp, int, date, text } from 'drizzle-orm/mysql-core';

export const entities = mysqlTable('ENTITIES', {
  id: int('entity_id').autoincrement().primaryKey(),
  type: varchar('entity_type', { length: 10 }),
  legalName: varchar('entity_legal_name', { length: 50 }),
  firstName: varchar('entity_first_name', { length: 50 }),
  middleName: varchar('entity_middle_name', { length: 50 }),
  lastName: varchar('entity_last_name', { length: 50 }),
  maidenName: varchar('entity_maiden_name', { length: 50 }),
  nickname: varchar('entity_nickname', { length: 100 }),
  gender: varchar('entity_gender', { length: 1 }),
  birthday: date('entity_birthday', { mode: 'date' }),
  deathday: date('entity_deathday', { mode: 'date' }),
  description: text('entity_description'),
  email: varchar('entity_email', { length: 50 }),
  phone: varchar('entity_phone', { length: 50 }),
  website: varchar('entity_website', { length: 100 }),
  createdDate: timestamp('entity_created_date').notNull().defaultNow(),
  createdBy: int('entity_created_by'),
  modifiedDate: timestamp('entity_modified_date'),
  modifiedBy: int('entity_modified_by'),
});

export const roles = mysqlTable('roles', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
});

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  roleId: int('role_id').references(() => roles.id),
  entityId: int('entity_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
