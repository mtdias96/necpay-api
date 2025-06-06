import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { accounts } from '../auth/account';

export const stores = pgTable('stores', {
  id: uuid('id').defaultRandom().primaryKey(),
  nameStore: varchar('name', { length: 244 }).unique().notNull(),
  emailStore: varchar('email'),
  phoneStore: varchar('phone'),
  accountId: uuid('account_id').references(() => accounts.id),
  createdAt: timestamp('created_at').defaultNow(),
});
