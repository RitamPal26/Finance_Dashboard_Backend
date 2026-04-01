import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import prisma from "../config/db";
import { transactionSchema } from "../validators/transactionValidator";

export const createTransaction = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = transactionSchema.parse(req.body);

    const transaction = await prisma.transaction.create({
      data: {
        ...validatedData,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
        userId: req.user!.id,
      },
    });

    res.status(201).json(transaction);
  } catch (error: any) {
    if (error.errors) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: "Server error creating transaction" });
    }
  }
};

export const getTransactions = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user!.id },
      orderBy: { date: "desc" },
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching transactions" });
  }
};
