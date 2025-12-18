import express from 'express'
import { getEvent, getEventsByMonth, getEventsForCalendar, getEventTypes, getLatestUpdates, getNewEvents, getTodaysEvents, lastupdated, searchEventsByName } from '../controller/eventController.js';

const router = express.Router();

router.get('/getEventTypes', getEventTypes);
router.get('/getTodaysEvents', getTodaysEvents);
router.get("/search", searchEventsByName);
router.get('/by-month', getEventsByMonth);   
router.get('/latest', getLatestUpdates);
router.get('/lastupdated', lastupdated);
router.get('/', getEventsForCalendar);
router.get('/:eventId' ,getEvent);
router.get('/isNew/:event_id', getNewEvents);

export default router;
