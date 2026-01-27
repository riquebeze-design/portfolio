import { Router } from 'express';
import { createWork, getWorksAdmin, getWorkByIdAdmin, updateWork, deleteWork } from '../../controllers/admin/work.admin.controller';
import { validate } from '../../middleware/validation.middleware';
import { createWorkSchema, updateWorkSchema } from '../../validation/work.validation';

const router = Router();

router.get('/', getWorksAdmin);
router.get('/:id', getWorkByIdAdmin);
router.post('/', validate(createWorkSchema), createWork);
router.put('/:id', validate(updateWorkSchema), updateWork);
router.delete('/:id', deleteWork);

export default router;