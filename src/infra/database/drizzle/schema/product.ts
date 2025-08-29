import {
  index,
  integer,
  numeric,
  pgEnum,
  pgTable, text, timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { categoriesTable } from './categories';
import { storesTable } from './stores';

export const productStatusEnum = pgEnum('product_status', [
  'UPLOADING',
  'QUEUED',
  'PROCESSING',
  'SUCCESS',
  'FAILED',
]);

export const productsTable = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().notNull(),
    storeId: uuid('store_id')
      .references(() => storesTable.id, { onDelete: 'cascade' })
      .notNull(),
    categoryId: uuid('category_id')
      .references(() => categoriesTable.id, { onDelete: 'cascade' })
      .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    inputFileKey: varchar('image_path', { length: 500 }),
    barcode: varchar('barcode', { length: 50 }).unique(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    costPrice: numeric('cost_price', { precision: 10, scale: 2 }).notNull(),
    stockAlert: integer('stock_alert').notNull().default(0),
    currentStock: integer('current_stock').notNull().default(0),
    inputType: varchar('input_type', { length: 50 }),
    status: productStatusEnum('status').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },

  (table) => [
    index('products_store_id_idx').on(table.storeId),
    index('products_barcode_idx').on(table.barcode),
    index('products_store_category_idx').on(table.storeId, table.categoryId),
    index('products_store_barcode_idx').on(table.storeId, table.barcode),
  ],
);
