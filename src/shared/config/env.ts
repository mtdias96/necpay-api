import { z } from 'zod';

export const schema = z.object({
  DATABASE_URL: z.string().min(1),
  COGNITO_CLIENT_ID: z.string().min(1),
  COGNITO_POOL_ID: z.string().min(1),
  COGNITO_CLIENT_SECRET: z.string().min(1),
  PRODUCTS_BUCKET: z.string().min(1),
});

export const env = schema.parse(process.env);
