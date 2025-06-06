import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { accounts } from '../auth/account';

export const stores = pgTable('stores', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 244 }).unique().notNull(),
  email: varchar('email'),
  phone: varchar('phone'),
  accountId: uuid('account_id').references(() => accounts.id),
  createdAt: timestamp('created_at').defaultNow(),
});
