import express from 'express'
import { getEvent, getLatestUpdates, lastupdated } from '../controller/eventController.js';

const router = express.Router();

router.get('/latest', getLatestUpdates)
router.get('/lastupdated', lastupdated);
router.get('/:eventId' ,getEvent);

export default router;