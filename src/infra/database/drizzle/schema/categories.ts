import { boolean, index, pgTable, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { storesTable } from './stores';

export const categoriesTable = pgTable(
  'categories',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    storeId: uuid('store_id')
      .references(() => storesTable.id, { onDelete: 'cascade' })
      .notNull(),
    name: varchar('name', { length: 244 }).notNull(),
    iconPath: varchar('icon_path', { length: 500 }),
    active: boolean('active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('categories_store_id_name_idx').on(table.storeId, table.name),
    unique('categories_store_id_name_unique').on(table.storeId, table.name),
  ],
);
