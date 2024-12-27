import { Router } from 'express';
import exportFileController from '../controllers/exportFile.controller.js';
import { adminAuthMiddleware, authMiddleware } from '../middlewares/auth.middleware.js';

const ExportFileRouter = Router();

ExportFileRouter.get('/export-file', exportFileController.exportProductCSV);

export default ExportFileRouter;