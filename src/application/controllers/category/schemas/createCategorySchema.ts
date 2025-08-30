import { mbToBytes } from '@shared/utils/mbToBytes';
import z from 'zod';

export const createCategorySchema = z.object({
  name: z.string()
    .min(1, 'O nome é obrigatório.'),
  file: z.object({
      type: z.literal('image/jpeg'),
      size: z.number()
        .min(1, 'The file should have at least 1 byte.')
        .max(mbToBytes(10), 'The file should have up to 10MB.')
      ,
    }),
});

export type createCategoryBody = z.infer<typeof createCategorySchema>;
