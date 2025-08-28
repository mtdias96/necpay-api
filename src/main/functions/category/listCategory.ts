import 'reflect-metadata';

import { ListCategoryController } from '@application/controllers/category/ListCategoriesController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(ListCategoryController);

export const handler = lambdaHttpAdapter(controller);
