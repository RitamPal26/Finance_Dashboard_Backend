import { Request, Response, NextFunction } from 'express';

import { DashboardService } from '../services/dashboardService';

export class DashboardController {
  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const dashboardData = await DashboardService.getFullDashboard();
      res.status(200).json({
        status: 'success',
        data: dashboardData,
      });
    } catch (error) {
      next(error);
    }
  }
}
