import z from 'zod';

export const createCategorySchema = z.object({
  name: z.string()
    .min(1, 'O nome é obrigatório.'),
  storeId: z.string()
    .min(1, 'O storeId é obrigatório.'),

});

export type createCategoryBody = z.infer<typeof createCategorySchema>;
