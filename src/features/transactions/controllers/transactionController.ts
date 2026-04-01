import { Response } from "express";
import { AuthRequest } from "../../../middleware/authMiddleware";
import { TransactionService } from "../services/transactionService";
import { transactionSchema } from "../schemas/transactionSchema";

export class TransactionController {
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const validatedData = transactionSchema.parse(req.body);
      const transaction = await TransactionService.createTransaction(
        req.user!.id,
        validatedData,
      );

      res.status(201).json(transaction);
    } catch (error: any) {
      if (error.errors) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Server error creating transaction" });
      }
    }
  }

  static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const transactions = await TransactionService.getTransactionsByUserId(
        req.user!.id,
      );
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Server error fetching transactions" });
    }
  }
}
