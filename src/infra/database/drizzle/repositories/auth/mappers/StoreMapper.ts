import { Store } from '@application/entities/Store';
import { stores } from '@infra/database/drizzle/schema/store/stores';

export class StoreMapper {
  static toEntity(raw: typeof stores.$inferSelect): Store {
    return new Store({
      id: raw.id,
      nameStore: raw.name,
      accountId: raw.accountId!,
      emailStore: raw.email!,
      phoneStore: raw.phone!,
      createdAt: raw.createdAt!,
    });
  }

  static toPersistence(store: Store): typeof stores.$inferInsert {
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
