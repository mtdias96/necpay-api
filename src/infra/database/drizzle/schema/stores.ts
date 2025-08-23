
import { pgEnum, pgTable, primaryKey, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { accountsTable } from './accounts';

export const storesTable = pgTable('stores', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 244 }).unique().notNull(),
  email: varchar('email'),
  phone: varchar('phone'),

  accountId: uuid('account_id').references(() => accountsTable.id).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),

});

export const storeRole = pgEnum('role', [
  'OWNER',
  'ADMIN',
  'MEMBER',
  'READONLY',
]);

export const storeEmployee = pgTable('store_employees', {
  accountId: uuid('account_id').references(() => accountsTable.id).notNull(),
  storeId: uuid('store_id').references(() => storesTable.id).notNull(),
  role: storeRole('role').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.accountId, table.storeId] }),
]);
