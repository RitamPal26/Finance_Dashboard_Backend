import { Response } from 'express';
import { AuthRequest } from '../../../middleware/authMiddleware';
import { DashboardService } from '../services/dashboardService';

export class DashboardController {
  static async getSummary(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await DashboardService.getSummary(req.user!.id);
      res.status(200).json(data);
    } catch {
      res.status(500).json({ _error: 'Server error generating dashboard summary' });
    }
  }
}
