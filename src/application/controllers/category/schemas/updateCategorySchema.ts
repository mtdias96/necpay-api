import z from 'zod';

export const updateCategorySchema = z.object({
  categoryUpdate: z.object({
    name: z.string().optional(),
    icon_path: z.string().optional(),
    active: z.boolean().optional(),
  }).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' },
  ),
});

export type UpdateCategoryBody = z.infer<typeof updateCategorySchema>;
