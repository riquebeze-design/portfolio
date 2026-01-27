import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { loginSchema } from '../validation/auth.validation';

const router = Router();

router.post('/login', validate(loginSchema), login);

export default router;