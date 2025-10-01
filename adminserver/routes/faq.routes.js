import express from 'express';
import { 
    deleteFAQ, 
    postFAQ, 
    getAllFAQs, 
    getFAQsFromOrganization, 
    getFaqFromQuestion, 
    updateFAQ,
    getStateEnums 
} from '../controllers/FAQ.controller.js';

const router = express.Router();

router.post('/', postFAQ);
router.get('/', getAllFAQs);
router.get('/org/:orgId', getFAQsFromOrganization);
router.get('/states/enum', getStateEnums); 
router.get('/:question', getFaqFromQuestion);
router.delete('/:id', deleteFAQ);
router.put('/:id', updateFAQ);

export default router;
