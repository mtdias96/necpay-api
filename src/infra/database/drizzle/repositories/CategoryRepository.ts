import { Category } from '@application/entities/Category';
import { DrizzleClient } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { eq } from 'drizzle-orm';
import { categoriesTable } from '../schema/categories';

@Injectable()
export class CategoryRepository {
  constructor(private readonly db: DrizzleClient) { }

  async findByName(name: string): Promise<Category | null> {
    const result = await this.db.httpClient.select().from(categoriesTable).where(eq(categoriesTable.name, name));
    return result[0];
  }

  async create(
    category: Category,
  ): Promise<void> {
    await this.db.httpClient.insert(categoriesTable).values(category);
  }
}
