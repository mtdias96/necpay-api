import { GetSalesByPeriodQuery } from '@application/query/GetSalesByPeriodQuery';
import { TicketAverageService } from '@application/services/TicketAverageService';
import { Injectable } from '@kernel/decorators/Injectable';

/*
## Info que serão retornadas
  - Vendas -> Sale, Revenue, Ticket
*/

@Injectable()
export class GetSaleByPeriodUseCase {
  constructor(
    private readonly getSalePeriodQuery: GetSalesByPeriodQuery,
  ) { }

  async execute({ period, storeId }: GetSaleByPeriodUseCase.Input): Promise<GetSaleByPeriodUseCase.Output> {
    const { totalAmount, totalItems, totalOrders } = await this.getSalePeriodQuery.execute({ period, storeId });
    const { ticketAverage } = TicketAverageService.calculate({ totalAmount, totalOrders });

    const metricSales = {
      totalAmount,
      totalItems,
      totalOrders,
      ticketAverage,
    };

    return {
      metricSales,
    };
  }
}

export namespace GetSaleByPeriodUseCase {
  export type Input = {
    storeId: string;
    period: 'day' | 'week' | 'month' | 'custom';
  }

  export type Output = {
    metricSales: {
      totalOrders: number,
      totalAmount: string,
      totalItems: number,
      ticketAverage: number,
    }
  }
}
