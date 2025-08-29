import { Category } from '@application/entities/Category';
import { DrizzleClient } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { and, eq } from 'drizzle-orm';
import { categoriesTable, TCategory } from '../schema/categories';

@Injectable()
export class CategoryRepository {
  constructor(private readonly db: DrizzleClient) { }

  async create(
    category: Category,
  ): Promise<void> {
    await this.db.httpClient.insert(categoriesTable).values(category);
  }

  async update({
    categoryId,
    storeId,
    categoryUpdate,
  }: {
    categoryId: string
    storeId: string
    categoryUpdate: Partial<{ name: string; icon_path: string, active: boolean }>
  }): Promise<Category> {
    const result = await this.db.httpClient.update(categoriesTable)
      .set(categoryUpdate)
      .where(
        and(
          eq(categoriesTable.id, categoryId),
          eq(categoriesTable.storeId, storeId),
        ),
      ).returning();

    return result[0];
  }

  async delete(categoryId: string, storeId: string): Promise<void> {
     await this.db.httpClient.delete(categoriesTable).where(and(
          eq(categoriesTable.id, categoryId),
          eq(categoriesTable.storeId, storeId),
    ));
  }

  async findByName(name: string): Promise<Category | null> {
    const result = await this.db.httpClient.select().from(categoriesTable).where(eq(categoriesTable.name, name));
    return result[0];
  }

  async findById(categoryId: string, storeId: string): Promise<TCategory | undefined> {
    return await this.db.httpClient.query.categoriesTable.findFirst({
      where: (categories, { eq, and }) => and(
        eq(categories.id, categoryId),
        eq(categories.storeId, storeId),
      ),
    });
  }

}
