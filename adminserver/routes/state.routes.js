import express from 'express'
import { getStateList } from '../controllers/state.controller.js';

const router = express.Router();

router.get('/all', getStateList);

export default router;