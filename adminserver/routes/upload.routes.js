import express from 'express'
import { uploadCentralEvent } from '../controllers/upload.controller.js';

const router = express.Router();

router.post('/central', uploadCentralEvent);

export default router;