import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import prisma from "../config/db";

export const getDashboardSummary = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const aggregates = await prisma.transaction.groupBy({
      by: ["type"],
      where: { userId },
      _sum: { amount: true },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    aggregates.forEach((agg) => {
      if (agg.type === "INCOME") totalIncome = Number(agg._sum.amount) || 0;
      if (agg.type === "EXPENSE") totalExpense = Number(agg._sum.amount) || 0;
    });

    const netBalance = totalIncome - totalExpense;

    const expensesByCategory = await prisma.transaction.groupBy({
      by: ["category"],
      where: { userId, type: "EXPENSE" },
      _sum: { amount: true },
    });

    const chartData = expensesByCategory.map((item) => ({
      category: item.category,
      total: Number(item._sum.amount) || 0,
    }));

    res.status(200).json({
      summary: { totalIncome, totalExpense, netBalance },
      chartData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server error generating dashboard summary" });
  }
};
