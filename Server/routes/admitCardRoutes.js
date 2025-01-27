import express from 'express'
import {getAdmitCards} from '../controller/admitCardController.js';

const router = express.Router();

router.get("/", getAdmitCards);

export default router;