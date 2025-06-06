import { relations } from 'drizzle-orm';
import { accounts } from './auth/account';
import { stores } from './store/stores';

export const accountsRelations = relations(accounts, ({ many }) => ({
  stores: many(stores),
}));

export const storesRelations = relations(stores, ({ one }) => ({
  accounts: one(accounts, {
    fields: [stores.id],
    references: [accounts.id],
  }),
}));
