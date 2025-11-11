import express from 'express';
import { convertData } from '../controllers/openai.controller.js';

const router = express.Router();

router.post('/', convertData);

export default router;
