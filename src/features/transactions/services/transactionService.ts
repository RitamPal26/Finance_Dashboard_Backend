import prisma from '../../../config/db';

import { TransactionType } from '@prisma/client';

interface TransactionFilters {
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export class TransactionService {
  static async createTransaction(userId: string, data: any) {
    return prisma.transaction.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  static async getAllTransactions(filters: TransactionFilters) {
    const whereClause: any = {};

    if (filters.type) whereClause.type = filters.type;
    if (filters.category)
      whereClause.category = { contains: filters.category, mode: 'insensitive' };

    if (filters.startDate || filters.endDate) {
      whereClause.date = {};
      if (filters.startDate) whereClause.date.gte = new Date(filters.startDate);
      if (filters.endDate) whereClause.date.lte = new Date(filters.endDate);
    }

    return prisma.transaction.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
    });
  }

  static async getTransactionById(id: string) {
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) throw new Error('Transaction not found');
    return transaction;
  }

  static async updateTransaction(id: string, data: any) {
    const exists = await prisma.transaction.findUnique({ where: { id } });
    if (!exists) throw new Error('Transaction not found');

    return prisma.transaction.update({
      where: { id },
      data,
    });
  }

  static async deleteTransaction(id: string) {
    const exists = await prisma.transaction.findUnique({ where: { id } });
    if (!exists) throw new Error('Transaction not found');

    return prisma.transaction.delete({
      where: { id },
    });
  }
}
