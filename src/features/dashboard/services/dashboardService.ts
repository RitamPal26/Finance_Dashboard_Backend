import prisma from '../../../config/db';

export class DashboardService {
  static async getFullDashboard() {
    const totalsRaw = await prisma.transaction.groupBy({
      by: ['type'],
      _sum: { amount: true },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    totalsRaw.forEach(t => {
      if (t.type === 'INCOME') totalIncome = Number(t._sum.amount) || 0;
      if (t.type === 'EXPENSE') totalExpense = Number(t._sum.amount) || 0;
    });

    const categoryTotalsRaw = await prisma.transaction.groupBy({
      by: ['category', 'type'],
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    const categoryTotals = categoryTotalsRaw.map(c => ({
      category: c.category,
      type: c.type,
      amount: Number(c._sum.amount) || 0,
    }));

    const recentActivity = await prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      select: { id: true, amount: true, type: true, category: true, date: true },
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentTransactions = await prisma.transaction.findMany({
      where: { date: { gte: sixMonthsAgo } },
      select: { amount: true, type: true, date: true },
    });

    const trendsMap: Record<string, { income: number; expense: number }> = {};
    recentTransactions.forEach(t => {
      const monthYear = t.date.toISOString().slice(0, 7);
      if (!trendsMap[monthYear]) trendsMap[monthYear] = { income: 0, expense: 0 };

      if (t.type === 'INCOME') trendsMap[monthYear].income += Number(t.amount);
      else trendsMap[monthYear].expense += Number(t.amount);
    });

    return {
      summary: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
      },
      categoryTotals,
      monthlyTrends: trendsMap,
      recentActivity,
    };
  }
}
