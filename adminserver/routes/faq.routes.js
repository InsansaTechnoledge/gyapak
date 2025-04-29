import express from 'express';
import { deleteFAQ,postFAQ } from '../controllers/FAQ.controller.js';

const router = express.Router();

router.post('/', postFAQ);
router.delete('/:id', deleteFAQ);

export default router;