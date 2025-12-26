import express from "express";
import {
  getCentralOrganization,
  getOrganizationsByState,
  getAllOrganizations,
  getOrganizationById,
  getAllCategories,
  getAllAuthorities,
  createOrganizations,
  createOrganizationWithUpload,
  getOrganizationDependencies,
  cascadeDeleteOrganization,
  updateOrganization,
  upload,
} from "../controllers/organization.controller.js";

const router = express.Router();

router.get("/central", getCentralOrganization);
router.get("/state", getOrganizationsByState);
router.get("/categories", getAllCategories);
router.get("/authorities", getAllAuthorities);
router.get("/", getAllOrganizations);
router.get("/:organizationId/dependencies", getOrganizationDependencies);
router.get("/:organizationId", getOrganizationById); // Get single organization with logo
router.post("/", createOrganizations); //not being used in frontend
router.post("/upload", upload.single("logo"), createOrganizationWithUpload);
router.put("/:organizationId", updateOrganization);
router.delete("/cascade", cascadeDeleteOrganization);

export default router;
