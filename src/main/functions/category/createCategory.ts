import 'reflect-metadata';

import { CreateCategoryController } from '@application/controllers/category/createCategoryController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(CreateCategoryController);

export const handler = lambdaHttpAdapter(controller);
