import express from "express";
import { getCalendar, getCentralLogos,getMoreOrganization,getOrganization } from "../controller/organizationController.js";


const router = express.Router();

router.get('/calendar/:id', getCalendar);
router.get('/logo', getCentralLogos);
router.get('/:name', getOrganization);
router.get('/more/:category', getMoreOrganization);

export default router;

