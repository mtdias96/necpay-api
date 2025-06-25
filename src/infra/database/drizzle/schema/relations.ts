
import { relations } from 'drizzle-orm';
import { accountsTable } from './accounts';
import { storesTable } from './stores';

export const accountsRelations = relations(accountsTable, ({ many }) => ({
  stores: many(storesTable),
}));

export const storesRelations = relations(storesTable, ({ one }) => ({
  accounts: one(accountsTable, {
    fields: [storesTable.id],
    references: [accountsTable.id],
  }),
}));
