import express from 'express';
import { sendMailtoQueries,sendMailtoUser } from '../controller/contactController.js'
import {verifyField} from '../config/validator.js'

const router = express.Router();

router.post('/sendMail', verifyField,sendMailtoQueries);
router.post('/sendMailtoUser', sendMailtoUser);

export default router;
