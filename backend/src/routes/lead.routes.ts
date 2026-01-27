import { Router } from 'express';
import { createLead } from '../controllers/lead.controller';
import { validate } from '../middleware/validation.middleware';
import { createLeadSchema } from '../validation/lead.validation';

const router = Router();

router.post('/', validate(createLeadSchema), createLead);

export default router;