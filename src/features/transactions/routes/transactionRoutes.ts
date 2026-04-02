import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController';
import { authenticateJWT } from '../../../middleware/authMiddleware';
import { roleGuard } from '../../../middleware/roleGuard';

const router = Router();

router.use(authenticateJWT);
router.post('/', roleGuard(['ADMIN', 'ANALYST']), TransactionController.create);
router.get('/', roleGuard(['ADMIN', 'ANALYST', 'VIEWER']), TransactionController.getAll);

export default router;
