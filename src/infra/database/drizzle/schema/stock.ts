import { index, integer, numeric, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { productsTable } from './product';
import { storesTable } from './stores';

export const stockMovementsTable = pgTable('stock_movements', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeId: uuid('store_id').references(() => storesTable.id).notNull(),
  productId: uuid('product_id').references(() => productsTable.id).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'ENTRY' (compra) ou 'EXIT' (venda ou perda)
  quantity: integer('quantity').notNull(),
  costPrice: numeric('cost_price', { precision: 10, scale: 2 }),
  movementDate: timestamp('movement_date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('stock_movements_store_id_idx').on(table.storeId),
  index('stock_movements_product_id_idx').on(table.productId),
  index('stock_movements_movement_date_idx').on(table.movementDate),
]);
