import express from 'express';
import {sendInvoiceEmail,forgetPasswordEmail,newAccountEmail,newTestSeriesEmail,reminderEmail} from '../../controller/mongoController/email.controller.js';

const router= express.Router();

router.post('/invoiceEmail', sendInvoiceEmail);
router.post('/forgetPasswordEmail', forgetPasswordEmail);
router.post('/newAccountEmail', newAccountEmail);
router.post('/newTestSeriesEmail', newTestSeriesEmail);
router.post('/reminderEmail', reminderEmail);

export default router;