import { accountsTable } from './accounts';
import { categoriesTable } from './categories';
import { stockMovementsTable } from './stock';
import { storesTable } from './stores';

export * from '../schema';
export * from './accounts';
export * from './categories';
export * from './orders';
export * from './product';

export const schema = {
  accountsTable,
  storesTable,
  stockMovementsTable,
  categoriesTable,
};

export type Schema = typeof schema;
