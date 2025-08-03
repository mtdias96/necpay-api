import {
  index,
  integer,
  numeric,
  pgTable,
  uuid,
} from 'drizzle-orm/pg-core';
import { ordersTable } from './orders';
import { productsTable } from './product';

export const orderItemsTable = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .references(() => ordersTable.id)
    .notNull(),
  productId: uuid('product_id')
    .references(() => productsTable.id)
    .notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
}, (item) => [
  index('order_items_order_id_idx').on(item.orderId),
  index('order_items_product_id_idx').on(item.productId),
],
);

