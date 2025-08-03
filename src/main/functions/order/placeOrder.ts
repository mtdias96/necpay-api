import 'reflect-metadata';

import { PlaceOrderController } from '@application/controllers/order/PlaceOrderController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(PlaceOrderController);

export const handler = lambdaHttpAdapter(controller);
