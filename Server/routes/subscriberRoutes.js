import express from 'express';
import { create, unsubscribe  } from '../controller/subscriberController.js'
import { verifySubscriber } from '../middleware/validator.js';

const router=express.Router();

router.post('/create',verifySubscriber,create);
router.post('/unsubscribe', unsubscribe);


export default router;