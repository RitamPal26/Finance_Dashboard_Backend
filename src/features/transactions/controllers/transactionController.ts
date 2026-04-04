import { Request, Response, NextFunction } from 'express';

import { TransactionService } from '../services/transactionService';
import { AuthRequest } from '../../../middleware/authMiddleware';

export class TransactionController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const transaction = await TransactionService.createTransaction(req.user!.id, req.body);
      res.status(201).json({ status: 'success', transaction });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const transactions = await TransactionService.getAllTransactions(req.query);
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await TransactionService.getTransactionById(req.params.id as string);
      res.status(200).json(transaction);
    } catch (error: any) {
      if (error.message === 'Transaction not found')
        return res.status(404).json({ error: error.message });
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedTransaction = await TransactionService.updateTransaction(
        req.params.id as string,
        req.body,
      );
      res.status(200).json({ status: 'success', transaction: updatedTransaction });
    } catch (error: any) {
      if (error.message === 'Transaction not found')
        return res.status(404).json({ error: error.message });
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await TransactionService.deleteTransaction(req.params.id as string);
      res.status(200).json({ status: 'success', message: 'Transaction deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Transaction not found')
        return res.status(404).json({ error: error.message });
      next(error);
    }
  }
}
