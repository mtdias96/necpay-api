import { mbToBytes } from '@shared/utils/mbToBytes';
import z from 'zod';

export const createProductSchema = z.object({
  product: z.object({
    categoryId: z.string().min(0, 'categoryId é obrigatório'),
    name: z.string().min(1, 'Nome é obrigatório').max(255),
    barcode: z.string().max(50).optional(),
    price: z.coerce.number().min(0, 'Preço deve ser maior ou igual a 0'),
    costPrice: z.coerce.number().min(0, 'Preço de custo deve ser maior ou igual a 0'),
    stockAlert: z.number().int().min(0).default(0),
    currentStock: z.number().int().min(0).default(0),
    description: z.string().max(500),
  }),
  file: z.object({
    type: z.literal('image/jpeg'),
    size: z.number()
      .min(1, 'The file should have at least 1 byte.')
      .max(mbToBytes(10), 'The file should have up to 10MB.')
    ,
  }),
});

export type createProductBody = z.infer<typeof createProductSchema>;
