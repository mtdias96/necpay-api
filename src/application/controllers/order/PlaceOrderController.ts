import { Controller } from '@application/contracts/Controller';
import { Order } from '@application/entities/Order';
import { PlaceOrderUseCase } from '@application/usecases/order/PlaceOrderUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/Schema';
import { placeOrderBody, placeOrderSchema } from './schemas/placeOrderSchema';

@Injectable()
@Schema(placeOrderSchema)
export class PlaceOrderController extends Controller<
  'private',
  PlaceOrderController.Response
> {
  constructor(private readonly placeOrderUseCase: PlaceOrderUseCase) {
    super();
  }

  protected override async handle({
    body,
    storeId,
    accountId,

  }: Controller.Request<'private', placeOrderBody>): Promise<
    Controller.Response<PlaceOrderController.Response>
  > {
    const { saleOrder, methodPayment } = body;

    const order = await this.placeOrderUseCase.execute({ storeId, saleOrder, methodPayment, accountId });

    return {
      statusCode: 201,
      body: {
        order,
      },
    };
  }
}

export namespace PlaceOrderController {
  export type Response = {
    order: {
      orderId: string;
      total: number;
      items: number;
      status: Order.Status;
      paymentStatus: Order.PaymentStatus;
    }
  }
}
