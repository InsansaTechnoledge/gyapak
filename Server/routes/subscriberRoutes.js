import express from 'express';
import { create, unsubscribe , subscribeMail } from '../controller/subscriberController.js'

const router=express.Router();

router.post('/create',create);
router.post('/unsubscribe', unsubscribe);


export default router;