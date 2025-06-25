import { accountsTable } from './accounts';
import { storesTable } from './stores';

export const schema = {
  accountsTable,
  storesTable,
};

export type Schema = typeof schema;
