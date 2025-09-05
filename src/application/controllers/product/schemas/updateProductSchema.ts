import { mbToBytes } from '@shared/utils/mbToBytes';
import z from 'zod';

export const updateProductSchema = z.object({
  productUpdate: z.object({
    categoryId: z.string().optional(),
    name: z.string().max(255).optional(),
    barcode: z.string().max(50).optional(),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Formato inválido. Use: 99.99').refine(val => parseFloat(val) >= 0, 'Preço deve ser maior ou igual a 0').optional(),
    costPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Formato inválido. Use: 99.99').refine(val => parseFloat(val) >= 0, 'Preço de custo deve ser maior ou igual a 0').optional(),
    stockAlert: z.number().int().min(0).optional(),
    currentStock: z.number().int().min(0).optional(),
    description: z.string().max(500).optional(),
  }).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' },
  ),
  fileUpdate: z.object({
    type: z.literal('image/jpeg'),
    size: z.number()
      .min(1, 'O arquivo deve ter pelo menos 1 byte.')
      .max(mbToBytes(10), 'O arquivo deve ter até 10MB.'),
  }).optional(),
});

export type UpdateProductBody = z.infer<typeof updateProductSchema>;
