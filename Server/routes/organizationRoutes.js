import express from "express";
import { getAllCalendars, getCalendar, getCentralLogos,getMoreOrganization,getOrganization , getAllOrganizations, getOrganizationByCategoryId } from "../controller/organizationController.js";


const router = express.Router();

router.get('/calendar/all', getAllCalendars);
router.get('/all' , getAllOrganizations)
router.get('/calendar/:id', getCalendar);
router.get('/logo', getCentralLogos);
router.get('/:name', getOrganization);
router.get('/category/:categoryId', getOrganizationByCategoryId); // new one
router.get('/more/:category', getMoreOrganization);

export default router;

