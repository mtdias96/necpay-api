import 'reflect-metadata';

import { GetCategoryByIdController } from '@application/controllers/category/GetCategoryByIdController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(GetCategoryByIdController);

export const handler = lambdaHttpAdapter(controller);
