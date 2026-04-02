import prisma from '../../../config/db';

export class TransactionService {
  static async createTransaction(userId: string, data: Record<string, unknown>) {
    return await prisma.transaction.create({
      data: {
        ...data,
        date: data.date ? new Date(data.date) : new Date(),
        userId,
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
