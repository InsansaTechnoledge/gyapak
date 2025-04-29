import express from 'express';
import { deleteFAQ,postFAQ , getAllFAQs, getFAQsFromOrganization} from '../controllers/FAQ.controller.js';
 
const router = express.Router();
 
router.post('/', postFAQ);
router.get('/', getAllFAQs);
router.get('/org/:orgId', getFAQsFromOrganization);
router.delete('/:id', deleteFAQ);
 
export default router;
 