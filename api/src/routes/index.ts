import { Router } from 'express';
import softwareRoutes from './software.routes';

const router = Router();

router.use('/software', softwareRoutes);

export default router;
