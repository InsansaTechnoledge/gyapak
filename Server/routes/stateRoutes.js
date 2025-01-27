import express from 'express';
import { getStateByName, getCountDetails, getStateList, getMoreAuthorities } from '../controller/stateController.js';

const router = express.Router();

router.get('/count', getCountDetails);
router.get('/list', getStateList);
router.get('/more', getMoreAuthorities);
router.get('/name/:name', getStateByName);

export default router;