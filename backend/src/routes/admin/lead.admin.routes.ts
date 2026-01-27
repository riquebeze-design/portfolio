import { Router } from 'express';
import { getLeadsAdmin, deleteLead } from '../../controllers/admin/lead.admin.controller';

const router = Router();

router.get('/', getLeadsAdmin);
router.delete('/:id', deleteLead);

export default router;