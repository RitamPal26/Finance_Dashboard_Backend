import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().positive('Amount must be greater than zero'),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, 'Category is required'),
  date: z.string().optional(),
  notes: z.string().optional(),
});
