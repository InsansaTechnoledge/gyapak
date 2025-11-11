import express from 'express';
import { getWeeklyReport, getWeeklyComparison } from '../controllers/report.controller.js';

const router = express.Router();

router.get('/weekly', getWeeklyReport);

router.get('/comparison', getWeeklyComparison);

export default router;
