import express from 'express';
import { AddResultAdmitCard, GetsultResultsAdmitcards } from '../controllers/QuickResultAdmitcard.controller.js';

const router = express.Router();

router.post('/quick-result', AddResultAdmitCard);
router.get('/get-results', GetsultResultsAdmitcards);

export default router;