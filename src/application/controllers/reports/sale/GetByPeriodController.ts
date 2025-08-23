import { Controller } from '@application/contracts/Controller';
import { GetSaleByPeriodUseCase } from '@application/usecases/reports/sales/GetSaleByPeriodUseCase';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class GetSaleByPeriodController extends Controller<'private', GetSaleByPeriodController.Response> {
  constructor(
    private readonly getSaleByPeriodUseCase: GetSaleByPeriodUseCase,
  ) {
    super();
  }

  async handle({
    storeId,
    queryParams,
  }: Controller.Request<'private'>): Promise<Controller.Response<GetSaleByPeriodController.Response>> {
    const { period } = queryParams as {
      period: 'day' | 'week' | 'month' | 'custom';
      from?: string;
      to?: string;
    };

    const { metricSales } = await this.getSaleByPeriodUseCase.execute({
      storeId,
      period,
    });

    return {
      statusCode: 200,
      body: {
        metricSales,
      },
    };
  }
}

export namespace GetSaleByPeriodController {
  export type Response = {
    metricSales: {
      totalOrders: number,
      totalAmount: string,
      totalItems: number;
      ticketAverage: number;
    }
  }
}
