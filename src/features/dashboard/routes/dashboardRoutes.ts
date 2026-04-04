import { Router } from 'express';

import { DashboardController } from '../controllers/dashboardController';
import { authenticateJWT } from '../../../middleware/authMiddleware';
import { roleGuard } from '../../../middleware/roleGuard';

const router = Router();

router.get(
  '/summary',
  authenticateJWT,
  roleGuard(['ADMIN', 'ANALYST']),
  DashboardController.getSummary,
);

export default router;
