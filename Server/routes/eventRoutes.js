import express from 'express'
import { getEvent, getEventsForCalendar, getEventTypes, getLatestUpdates, getTodaysEvents, lastupdated } from '../controller/eventController.js';

const router = express.Router();

router.get('/getEventTypes',getEventTypes);
router.get('/getTodaysEvenets',getTodaysEvents);
router.get('/latest', getLatestUpdates)
router.get('/lastupdated', lastupdated);
router.get('/', getEventsForCalendar);
router.get('/:eventId' ,getEvent);


export default router;