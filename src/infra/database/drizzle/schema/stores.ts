
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { accountsTable } from './accounts';

export const storesTable = pgTable('stores', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 244 }).unique().notNull(),
  email: varchar('email'),
  phone: varchar('phone'),
  accountId: uuid('account_id').references(() => accountsTable.id),
  createdAt: timestamp('created_at').defaultNow(),
});
