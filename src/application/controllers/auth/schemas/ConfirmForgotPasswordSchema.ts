import z from 'zod';

export const confirmForgotPasswordSchema = z.object({
  code: z.string().min(1, '"code" is required.'),
  email: z.string().min(1, '"email" is required.').email('Invalid email'),
  password: z.string().min(8, '"password" should be 8 characters min long'),
});

export type ConfirmForgotPasswordBody = z.infer<typeof confirmForgotPasswordSchema>
