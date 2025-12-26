// routes/events.js
import express from 'express';
import {
  createEventController,
  assignSubjectsToEventController,
  assignQuestionsToEventController,
  getFullEventDetailsController,
  updateEventStatusController,
  deleteEventController,
  getEventsForExamController,
  getEventAttemptsByUser,
  incrementEventAttemptsByUser,
  deleteEventAttemptsByUser
} from '../../controller/supabseController/event.controller.js';
import { getApplyLinks } from '../../controller/eventController.js';

const router = express.Router();

router.get('/attempts/:eventId',getEventAttemptsByUser);
router.post('/attempts', incrementEventAttemptsByUser);
router.delete('/attempts', deleteEventAttemptsByUser)
router.post('/', createEventController);
router.get('/by-exam/:exam_id', getEventsForExamController)
router.post('/:event_id/subjects', assignSubjectsToEventController);
router.post('/:event_id/questions', assignQuestionsToEventController);
router.get('/:event_id', getFullEventDetailsController);
router.put('/:id/status', updateEventStatusController);
router.delete('/:id', deleteEventController);

export default router;
