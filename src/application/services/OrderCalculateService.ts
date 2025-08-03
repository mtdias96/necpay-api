export class OrderCalculateService {
  static calculate({ saleCart }: OrderCalculateService.Input): OrderCalculateService.Output {
    const total = saleCart.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const items = saleCart.reduce((acc, item) => acc + item.quantity, 0);

    return {
      total,
      items,
    };
  }
}

export namespace OrderCalculateService {
  export type Input = {
    saleCart: {
      price: number;
      quantity: number;
    }[];
  };

  export type Output = {
    total: number;
    items: number;
  };
}
