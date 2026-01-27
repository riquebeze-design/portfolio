import { Router } from 'express';
import { getAdminStats } from '../controllers/admin.controller';
import workAdminRoutes from './admin/work.admin.routes';
import leadAdminRoutes from './admin/lead.admin.routes';
// uploadRoutes será removido, pois usaremos Supabase Storage
// import uploadRoutes from './admin/upload.routes';

const router = Router();

router.get('/stats', getAdminStats);
router.use('/works', workAdminRoutes);
router.use('/leads', leadAdminRoutes);
// router.use('/uploads', uploadRoutes); // Removido

export default router;