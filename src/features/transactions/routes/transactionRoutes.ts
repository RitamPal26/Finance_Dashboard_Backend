import { Router } from 'express';

import { TransactionController } from '../controllers/transactionController';
import { validate } from '../../../middleware/validateMiddleware';
import {
  transactionQuerySchema,
  transactionIdParamSchema,
  updateTransactionSchema,
  createTransactionSchema,
} from '../schemas/transactionSchema';

import { authenticateJWT } from '../../../middleware/authMiddleware';
import { roleGuard } from '../../../middleware/roleGuard';

const router = Router();

router.use(authenticateJWT);

router.get(
  '/',
  roleGuard(['ADMIN', 'ANALYST']),
  validate(transactionQuerySchema),
  TransactionController.getAll,
);
router.get(
  '/:id',
  roleGuard(['ADMIN', 'ANALYST']),
  validate(transactionIdParamSchema),
  TransactionController.getById,
);

router.post(
  '/',
  roleGuard(['ADMIN']),
  validate(createTransactionSchema),
  TransactionController.create,
);
router.patch(
  '/:id',
  roleGuard(['ADMIN']),
  validate(updateTransactionSchema),
  TransactionController.update,
);
router.delete(
  '/:id',
  roleGuard(['ADMIN']),
  validate(transactionIdParamSchema),
  TransactionController.delete,
);

export default router;
