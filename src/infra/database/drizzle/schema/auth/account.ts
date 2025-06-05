import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  externalId: text('externalId').notNull(),
});
