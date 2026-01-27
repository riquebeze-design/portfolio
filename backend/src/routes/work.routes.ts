import { Router } from 'express';
import { getWorks, getWorkBySlug } from '../controllers/work.controller';

const router = Router();

router.get('/', getWorks);
router.get('/:slug', getWorkBySlug);

export default router;