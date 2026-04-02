import prisma from '../../../config/db';

export class DashboardService {
  static async getSummary(userId: string) {
    const aggregates = await prisma.transaction.groupBy({
      by: ['type'],
      where: { userId },
      _sum: { amount: true },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    aggregates.forEach(agg => {
      if (agg.type === 'INCOME') totalIncome = Number(agg._sum.amount) || 0;
      if (agg.type === 'EXPENSE') totalExpense = Number(agg._sum.amount) || 0;
    });

    const netBalance = totalIncome - totalExpense;

    const expensesByCategory = await prisma.transaction.groupBy({
      by: ['category'],
      where: { userId, type: 'EXPENSE' },
      _sum: { amount: true },
    });

    const chartData = expensesByCategory.map(item => ({
      category: item.category,
      total: Number(item._sum.amount) || 0,
    }));

    return { summary: { totalIncome, totalExpense, netBalance }, chartData };
  }
}
