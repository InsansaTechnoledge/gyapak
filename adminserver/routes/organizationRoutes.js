import express from 'express'
import { 
  getCentralOrganization, 
  getOrganizationsByState, 
  getAllOrganizations,
  getAllCategories,
  getAllAuthorities,
  createOrganizations,
  createOrganizationWithUpload,
  upload
} from '../controllers/organization.controller.js';

const router = express.Router();

router.get('/central', getCentralOrganization);
router.get('/state', getOrganizationsByState);
router.get('/categories', getAllCategories);
router.get('/authorities', getAllAuthorities);
router.get('/', getAllOrganizations);
router.post('/', createOrganizations);
router.post('/upload', upload.single('logo'), createOrganizationWithUpload);

export default router;