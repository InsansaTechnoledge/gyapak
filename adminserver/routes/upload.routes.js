import express from 'express'
import { uploadEvent } from '../controllers/upload.controller.js';

const router = express.Router();

router.post('/', uploadEvent);

export default router;