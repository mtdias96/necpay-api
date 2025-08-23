export class TicketAverageService {
  static calculate({ totalAmount, totalOrders }: OrderCalculateService.Input): OrderCalculateService.Output {
    const ticketAverage = totalOrders === 0 ? 0 : Number(totalAmount) / totalOrders;

    return { ticketAverage };

  }
}

export namespace OrderCalculateService {
  export type Input = {
    totalAmount: string;
    totalOrders: number;
  };

  export type Output = {
    ticketAverage: number;
  };
}
