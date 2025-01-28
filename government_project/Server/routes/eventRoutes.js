import express from "express";
import {createEventType} from '../controller/eventController.js';

const router = express.Router();

router.post('/createEventType',createEventType);

export default router;