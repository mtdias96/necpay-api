import { z } from 'zod';

export const filterSchema = z.object({
  name: z.string().optional(),
  categoryId: z.string().optional(),
  stockLow: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  order: z.enum(['asc', 'desc']).default('desc'),
  orderBy: z.enum(['created_at', 'name', 'price']).default('created_at'),
});

export type FilteredParams = z.infer<typeof filterSchema>;
