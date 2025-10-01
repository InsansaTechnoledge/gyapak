import Organization from "../models/OrganizationModel.js";
import Authority from "../models/AuthorityModel.js";
import Category from "../models/CategoryModel.js";
import { bufferToBase64Raw, getDefaultLogoBase64, isValidImage } from "../utils/imageUtils.js";
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.memoryStorage();
export const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (isValidImage(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

export const getCentralOrganization = async (req, res) => {
  try {
    const centralAuthority = await Authority.findOne({
      type: "Central_Government",
    });
    if (!centralAuthority) {
      return res.status(200).json({ centralOrganizations: [] });
    }
    const centralOrganizationIds = centralAuthority.organizations;

    const centralOrganizations = await Organization.find(
      { _id: { $in: centralOrganizationIds } },
      { _id: 1, abbreviation: 1, name: 1 } // 1 to include fields, 0 to exclude
    );

    // Return the data to the frontend
    return res.status(200).json(centralOrganizations);
  } catch (error) {
    console.error("Error fetching logos:", error);
    res.status(500).json({ error: "An error occurred while fetching logos." });
  }
};

export const getOrganizationsByState = async (req, res) => {
  try {
    const state_id = req.query.stateId;

    const stateData = await Authority.findById(state_id);

    const organizationIds = stateData.organizations;

    const organizations = await Organization.find(
      {
        _id: { $in: organizationIds },
      },
      {
        name: 1,
        abbreviation: 1,
      }
    );

    res.status(200).json(organizations);
  } catch (err) {
    console.log(err);
  }
};

export const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find(
      {},
      {
        _id: 1,
        name: 1,
        abbreviation: 1,
        description: 1,
      }
    );

    return res
      .status(200)
      .json({ message: "Organizations fetched", organizations: organizations });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .select("category description")
      .sort({ category: 1 });
    res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error("getAllCategories Error:", error.message);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const getAllAuthorities = async (req, res) => {
  try {
    const authorities = await Authority.find()
      .select("name description type")
      .sort({ name: 1 });
    res.status(200).json({
      message: "Authorities fetched successfully",
      authorities,
    });
  } catch (error) {
    console.error("getAllAuthorities Error:", error.message);
    res.status(500).json({ error: "Failed to fetch authorities" });
  }
};

export const createOrganizations = async (req, res) => {
  try {
    const organizations = req.body;

    if (!Array.isArray(organizations)) {
      return res
        .status(400)
        .json({ error: "Invalid input. Expected an array of organizations." });
    }

    const savedOrganizations = [];

    for (let org of organizations) {
      // Find parent authority
      const parent = await Authority.findOne({ name: org.parent_organization });
      if (!parent) {
        return res.status(400).json({
          error: `Parent authority not found: ${org.parent_organization}`,
        });
      }

      // Find or create category
      let category = await Category.findOne({ category: org.category });
      if (!category) {
        category = new Category({
          category: org.category,
          description: `Category for ${org.category}`,
        });
        await category.save();
      }

      // Handle logo - convert to base64 if provided
      let logoBase64 = "";
      if (org.logo) {
        // If logo is provided as a file buffer or URL, convert to base64
        logoBase64 = org.logo;
      } else {
        // Use default logo
        logoBase64 = await getDefaultLogoBase64();
      }

      // Create new organization
      const newOrg = new Organization({
        name: org.name,
        abbreviation: org.abbreviation,
        description: org.description,
        category: category._id,
        logo: logoBase64,
      });

      await newOrg.save();
      savedOrganizations.push(newOrg);

      // Update relationships
      if (!category.organizations) category.organizations = [];
      category.organizations.push(newOrg._id);
      await category.save();

      if (!parent.organizations) parent.organizations = [];
      parent.organizations.push(newOrg._id);
      await parent.save();
    }

    res.status(201).json({
      message: "Organizations created successfully",
      savedOrganizations,
    });
  } catch (error) {
    console.error("createOrganizations Error:", error.message);
    res.status(500).json({ error: "Failed to create organizations" });
  }
};

// Create organization with file upload support
export const createOrganizationWithUpload = async (req, res) => {
  try {
    const { name, abbreviation, description, category, parent_organization } = req.body;

    // Find parent authority
    const parent = await Authority.findOne({ name: parent_organization });
    if (!parent) {
      return res.status(400).json({
        error: `Parent authority not found: ${parent_organization}`,
      });
    }

    // Find or create category
    let categoryDoc = await Category.findOne({ category: category });
    if (!categoryDoc) {
      categoryDoc = new Category({
        category: category,
        description: `Category for ${category}`,
      });
      await categoryDoc.save();
    }

    // Handle logo upload
    let logoBase64 = "";
    if (req.file) {
      // Convert uploaded file to base64
      logoBase64 = bufferToBase64Raw(req.file.buffer);
    } else {
      // Use default logo
      logoBase64 = await getDefaultLogoBase64();
    }

    // Create new organization
    const newOrg = new Organization({
      name,
      abbreviation,
      description,
      category: categoryDoc._id,
      logo: logoBase64,
    });

    await newOrg.save();

    // Update relationships
    if (!categoryDoc.organizations) categoryDoc.organizations = [];
    categoryDoc.organizations.push(newOrg._id);
    await categoryDoc.save();

    if (!parent.organizations) parent.organizations = [];
    parent.organizations.push(newOrg._id);
    await parent.save();

    res.status(201).json({
      message: "Organization created successfully",
      organization: newOrg,
    });
  } catch (error) {
    console.error("createOrganizationWithUpload Error:", error.message);
    res.status(500).json({ error: "Failed to create organization" });
  }
};
