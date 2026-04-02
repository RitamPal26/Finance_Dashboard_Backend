import { z } from 'zod';
import prisma from '../../../config/db';
import { transactionSchema } from '../schemas/transactionSchema';

type TransactionInput = z.infer<typeof transactionSchema>;

export class TransactionService {
  static async createTransaction(userId: string, data: TransactionInput) {
    const { amount, type, category, notes, date } = data;

    return await prisma.transaction.create({
      data: {
        amount,
        type,
        category,
        userId,
        notes: notes ?? null,
        date: date ? new Date(date) : new Date(),
      },
    });
  }

  static async getTransactionsByUserId(userId: string) {
    return await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }
}
