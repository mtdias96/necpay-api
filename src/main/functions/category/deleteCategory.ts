import 'reflect-metadata';

import { DeleteCategoryController } from '@application/controllers/category/DeleteCategoryController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(DeleteCategoryController);

export const handler = lambdaHttpAdapter(controller);
