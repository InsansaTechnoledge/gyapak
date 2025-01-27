import express from 'express';
import { sendMailtoQueries,sendMailtoUser } from '../controller/contactController.js'

const router = express.Router();

router.post('/sendMail', sendMailtoQueries);
router.post('/sendMailtoUser', sendMailtoUser);

export default router;
