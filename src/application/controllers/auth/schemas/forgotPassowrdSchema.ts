import z from 'zod';

export const forgotPassowrdSchema = z.object({
  email: z.string().min(1, '"email" is required.').email('Invalid email'),
});

export type ForgotPassowrdBody = z.infer<typeof forgotPassowrdSchema>
