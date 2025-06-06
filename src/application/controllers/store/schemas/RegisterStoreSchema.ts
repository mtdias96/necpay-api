import z from 'zod';

export const registerStoreSchema = z.object({
  store: z.object({
    nameStore: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    phone: z.string(),
    accountId: z.string().min(1),

  }),

});

export type RegisterStoreBody = z.infer<typeof registerStoreSchema>;
