import express from 'express';
import { deleteEvent, getEvent, updateEvent } from '../controllers/event.controller.js';

const router = express.Router();

router.get('/:eventId', getEvent);
router.post('/:id', updateEvent);
router.delete('/', deleteEvent);

export default router;