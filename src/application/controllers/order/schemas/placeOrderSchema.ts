import z from 'zod';

export enum MethodPayment {
  CASH = 'cash',
  PIX = 'pix',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
}

export const methodPaymentSchema = z.nativeEnum(MethodPayment);

export const placeOrderSchema = z.object({
  saleOrder: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z
        .number()
        .transform((val) => Number(val))
        .refine((val) => val > 0, {
          message: 'Quantidade deve ser maior que zero',
        }),
    }),
  ),
  methodPayment: methodPaymentSchema,
});

export type placeOrderBody = z.infer<typeof placeOrderSchema>;
