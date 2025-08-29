import 'reflect-metadata';

import { UpdateCategoryController } from '@application/controllers/category/UpdateCategoryController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(UpdateCategoryController);

export const handler = lambdaHttpAdapter(controller);
