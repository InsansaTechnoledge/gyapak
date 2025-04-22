import express from 'express'
import { getEvent, getEventsByCategory, getLatestUpdates, lastupdated } from '../controller/eventController.js';

const router = express.Router();

router.get('/latest', getLatestUpdates)
router.get('/lastupdated', lastupdated);
router.get('/', getEventsByCategory);
router.get('/:eventId' ,getEvent);

export default router;