import { Router } from 'express';

import { AuthController } from '../controllers/authController';
import { validate } from '../../../middleware/validateMiddleware';
import { registerSchema } from '../schemas/authSchema';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', AuthController.login);

export default router;
