import express from 'express'
import { getEvent, getEventsForCalendar, getEventTypes, getLatestUpdates, getNewEvents, getTodaysEvents, lastupdated } from '../controller/eventController.js';

const router = express.Router();

router.get('/getEventTypes',getEventTypes);
router.get('/getTodaysEvents',getTodaysEvents);
router.get('/latest', getLatestUpdates)
router.get('/lastupdated', lastupdated);
router.get('/', getEventsForCalendar);
router.get('/:eventId' ,getEvent);
router.get('/isNew/:event_id', getNewEvents);


export default router;