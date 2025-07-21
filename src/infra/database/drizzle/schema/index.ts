import { accountsTable } from './accounts';
import { stockMovementsTable } from './stock';
import { storesTable } from './stores';

export const schema = {
  accountsTable,
  storesTable,
  stockMovementsTable,
};

export type Schema = typeof schema;
