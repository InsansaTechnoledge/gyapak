import express from 'express'
import { getApplyLinks, getEvent, getEventsByMonth, getEventsForCalendar, getEventsWithSalary, getEventTypes, getLatestEvents, getLatestUpdates, getNewEvents, getTodaysEvents, lastupdated, searchEventsByName } from '../controller/eventController.js';

const router = express.Router();

router.get('/getEventTypes', getEventTypes);
router.get('/links', getApplyLinks)

router.get('/latest-events', getLatestEvents)
router.get("/with-salary", getEventsWithSalary);
router.get('/getTodaysEvents', getTodaysEvents);
router.get("/search", searchEventsByName);
router.get('/by-month', getEventsByMonth);   
router.get('/latest', getLatestUpdates);
router.get('/lastupdated', lastupdated);
router.get('/', getEventsForCalendar);
router.get('/:eventId' ,getEvent);
router.get('/isNew/:event_id', getNewEvents);

export default router;
