import { z } from 'zod';
import { TransactionType } from '@prisma/client';

export const transactionIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid transaction ID format'),
  }),
});

export const transactionQuerySchema = z.object({
  query: z.object({
    type: z.nativeEnum(TransactionType, { error: 'Type must be INCOME or EXPENSE' }).optional(),
    category: z.string().optional(),
    startDate: z
      .string()
      .datetime({ message: 'Invalid startDate format. Use ISO-8601' })
      .optional(),
    endDate: z.string().datetime({ message: 'Invalid endDate format. Use ISO-8601' }).optional(),
  }),
});

export const createTransactionSchema = z.object({
  body: z
    .object({
      amount: z.number().positive('Amount must be greater than 0'),
      type: z.nativeEnum(TransactionType, { error: 'Type must be INCOME or EXPENSE' }),
      category: z.string().min(1, 'Category is required'),
      date: z.string().datetime().optional(),
      notes: z.string().optional().nullable(),
    })
    .strict(),
});

export const updateTransactionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid transaction ID format'),
  }),
  body: z
    .object({
      amount: z.number().positive('Amount must be greater than 0').optional(),
      type: z.nativeEnum(TransactionType).optional(),
      category: z.string().min(1).optional(),
      date: z.string().datetime().optional(),
      notes: z.string().optional().nullable(),
    })
    .strict(),
});
