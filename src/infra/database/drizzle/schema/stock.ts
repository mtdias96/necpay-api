import { index, integer, numeric, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { productsTable } from './product';
import { storesTable } from './stores';

export const stockMovementTypeEnum = pgEnum('stock_movement_type', ['ENTRY', 'EXIT']);

export const stockMovementsTable = pgTable('stock_movements', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeId: uuid('store_id').references(() => storesTable.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => productsTable.id, { onDelete: 'cascade' }).notNull(),
  type: stockMovementTypeEnum().notNull(),
  quantity: integer('quantity').notNull(),
  costPrice: numeric('cost_price', { precision: 10, scale: 2 }),
  movementDate: timestamp('movement_date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('stock_movements_store_id_idx').on(table.storeId),
  index('stock_movements_product_id_idx').on(table.productId),
  index('stock_movements_movement_date_idx').on(table.movementDate),
]);
