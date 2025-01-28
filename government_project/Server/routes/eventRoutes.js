import express from "express";
import {createEventType,addEvent} from '../controller/eventController.js';

const router = express.Router();

router.post('/createEventType',createEventType);
router.post('/addEvent',addEvent);

export default router;