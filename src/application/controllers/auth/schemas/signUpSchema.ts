import z from 'zod';

export const signUpSchema = z.object({
  account: z.object({
    name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
    email: z.string()
      .min(1, 'O e-mail é obrigatório.')
      .email('E-mail inválido'),
    password: z.string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
      .regex(/[\W_]/, 'A senha deve conter pelo menos um símbolo'),
  }),
});

export type SignUpBody = z.infer<typeof signUpSchema>;
