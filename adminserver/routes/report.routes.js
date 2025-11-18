import express from 'express';
import { downloadExcel, downloadPDF, getReport } from '../controllers/report.controller.js';

const router = express.Router();

router.get('/', getReport);

router.get('/download/pdf', downloadPDF);

router.get('/download/excel', downloadExcel);

export default router;
