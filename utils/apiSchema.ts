import { z } from 'zod';

export const ApiResponseSchema = z.object({
  id: z.string(),
  key: z.string(),
  version: z.number(),
  data: z.object({
    url: z.string().optional(),
    name: z.string().optional(),
    value: z.string().optional(),
    where: z.string().optional(),
  }),
  status: z.string(),
  createdAt: z.string(),
  prevHash: z.string().nullable(),
  hash: z.string().nullable(),
});
