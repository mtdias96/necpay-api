import {
  index, integer,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { accountsTable } from './accounts';
import { storesTable } from './stores';

export const statusEnum = pgEnum('order_status', ['completed', 'canceled', 'pending']);
export const paymentStatusEnum = pgEnum('payment_status', ['paid', 'refused', 'pending']);

export const ordersTable = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeId: uuid('store_id').references(() => storesTable.id).notNull(),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  totalItems: integer('total_items').notNull(),
  methodPayment: varchar('method_payment', { length: 15 }).notNull(),
  paymentStatus: paymentStatusEnum('payment_status').default('paid').notNull(),
  status: statusEnum('status').default('pending').notNull(),
  operatorId: uuid('operator_id').references(() => accountsTable.id).notNull(),
  fiscalId: varchar('fiscal_id', { length: 50 }).default('null'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
},
  (orders) => [
    index('orders_store_id_idx').on(orders.storeId),
    index('orders_status_idx').on(orders.status),
    index('orders_created_at_idx').on(orders.createdAt),
  ],
);
