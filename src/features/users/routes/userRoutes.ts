import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validate } from '../../../middleware/validateMiddleware';
import { updateUserSchema, userIdParamSchema } from '../schemas/userSchema';

import { authenticateJWT } from '../../../middleware/authMiddleware';
import { roleGuard } from '../../../middleware/roleGuard';

const router = Router();

router.use(authenticateJWT);
router.use(roleGuard(['ADMIN']));

// Routes
router.get('/', UserController.getAll);
router.get('/:id', validate(userIdParamSchema), UserController.getById);
router.patch('/:id', validate(updateUserSchema), UserController.update);
router.delete('/:id', validate(userIdParamSchema), UserController.deactivate);

export default router;
