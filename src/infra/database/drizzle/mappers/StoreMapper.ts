import { Store } from '@application/entities/Store';
import { storesTable } from '../schema/stores';

export class StoreMapper {
  static toEntity(raw: typeof storesTable.$inferSelect): Store {
    return new Store({
      id: raw.id,
      nameStore: raw.name,
      accountId: raw.accountId!,
      emailStore: raw.email!,
      phoneStore: raw.phone!,
      createdAt: raw.createdAt!,
    });
  }

  static toPersistence(store: Store): typeof storesTable.$inferInsert {
    return {
      id: store.id,
      name: store.nameStore,
      email: store.emailStore,
      phone: store.phoneStore,
      accountId: store.accountId,
      createdAt: store.createdAt,
    };
  }
}
