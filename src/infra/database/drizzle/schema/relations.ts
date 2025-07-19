
import { relations } from 'drizzle-orm';
import { accountsTable } from './accounts';
import { categoriesTable } from './categories';
import { productsTable } from './product';
import { stockMovementsTable } from './stock';
import { storesTable } from './stores';

export const accountsRelations = relations(accountsTable, ({ many }) => ({
  stores: many(storesTable),
}));

export const storesRelations = relations(storesTable, ({ one }) => ({
  accounts: one(accountsTable, {
    fields: [storesTable.accountId],
    references: [accountsTable.id],
  }),
}));

export const productsRelations = relations(productsTable, ({ one, many }) => ({
  store: one(storesTable, {
    fields: [productsTable.storeId],
    references: [storesTable.id],
  }),
  category: one(categoriesTable, {
    fields: [productsTable.categoryId],
    references: [categoriesTable.id],
  }),
  stockMovements: many(stockMovementsTable),
}));

export const stockMovementsRelations = relations(stockMovementsTable, ({ one }) => ({
  store: one(storesTable, {
    fields: [stockMovementsTable.storeId],
    references: [storesTable.id],
  }),
  product: one(productsTable, {
    fields: [stockMovementsTable.productId],
    references: [productsTable.id],
  }),
}));
