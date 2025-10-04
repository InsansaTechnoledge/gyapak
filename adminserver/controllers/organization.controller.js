import Organization from "../models/OrganizationModel.js";
import Authority from "../models/AuthorityModel.js";
import Category from "../models/CategoryModel.js";
import Event from "../models/EventModel.js";
import FAQ from "../models/FAQ.model.js";
import { bufferToBase64Raw, getDefaultLogoBase64, isValidImage } from "../utils/imageUtils.js";
import multer from 'multer';
import mongoose from 'mongoose';

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

export const getOrganizationById = async (req, res) => {
  try {
    const { organizationId } = req.params;

    // Validate organization ID
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return res.status(400).json({ 
        error: "Invalid organization ID format" 
      });
    }

    // Get organization with all details including logo
    const organization = await Organization.findById(organizationId)
      .populate('category', 'category description')
      .select('_id name abbreviation description logo category createdAt updatedAt');

    if (!organization) {
      return res.status(404).json({ 
        error: "Organization not found" 
      });
    }

    return res.status(200).json({
      message: "Organization details fetched successfully",
      organization: organization
    });
  } catch (err) {
    console.error("getOrganizationById Error:", err.message);
    res.status(500).json({ 
      error: "Failed to fetch organization details",
      details: err.message 
    });
  }
};

export const getAllOrganizations = async (req, res) => {
  try {
    // Add pagination and limit to handle large datasets
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000; // Default to 1000 organizations max
    const skip = (page - 1) * limit;

    // Get organizations with sorting (now supported by index)
    // Exclude logo field for faster loading in list view
    const organizations = await Organization.find({})
      .populate('category', 'category description')
      .select('_id name abbreviation description category createdAt')
      .sort({ name: 1 }) // Now safe with index
      .skip(skip)
      .limit(limit);

    // Get total count for pagination info
    const totalCount = await Organization.countDocuments({});

    return res
      .status(200)
      .json({ 
        message: "Organizations fetched", 
        organizations: organizations,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      });
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

// Get organization dependencies before deletion
export const getOrganizationDependencies = async (req, res) => {
  try {
    const { organizationId } = req.params;

    // Validate organization ID
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return res.status(400).json({ 
        error: "Invalid organization ID format" 
      });
    }

    // Check if organization exists
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ 
        error: "Organization not found" 
      });
    }

    // Find all events associated with this organization
    const events = await Event.find({ organization_id: organizationId })
      .select('name event_type date_of_notification date_of_commencement createdAt')
      .sort({ createdAt: -1 });

    // Find all FAQs associated with this organization
    const faqs = await FAQ.find({ organizationId: organizationId })
      .select('question state categories createdAt')
      .sort({ createdAt: -1 });

    // Find authorities that reference this organization
    const authorities = await Authority.find({ organizations: organizationId })
      .select('name type description');

    // Find categories that reference this organization
    const categories = await Category.find({ organizations: organizationId })
      .select('category description');

    // Calculate total dependencies
    const totalDependencies = events.length + faqs.length;

    const dependencyData = {
      organization: {
        _id: organization._id,
        name: organization.name,
        abbreviation: organization.abbreviation,
        description: organization.description
      },
      dependencies: {
        events: {
          count: events.length,
          items: events
        },
        faqs: {
          count: faqs.length,
          items: faqs
        },
        authorities: {
          count: authorities.length,
          items: authorities
        },
        categories: {
          count: categories.length,
          items: categories
        }
      },
      totalDependencies,
      canDelete: true, // Can be modified based on business rules
      warnings: []
    };

    // Add warnings based on dependencies
    if (events.length > 0) {
      dependencyData.warnings.push(`${events.length} event(s) will be permanently deleted`);
    }
    if (faqs.length > 0) {
      dependencyData.warnings.push(`${faqs.length} FAQ(s) will be permanently deleted`);
    }
    if (authorities.length > 0) {
      dependencyData.warnings.push(`Organization will be removed from ${authorities.length} authority(ies)`);
    }
    if (categories.length > 0) {
      dependencyData.warnings.push(`Organization will be removed from ${categories.length} category(ies)`);
    }

    res.status(200).json({
      message: "Organization dependencies retrieved successfully",
      data: dependencyData
    });

  } catch (error) {
    console.error("getOrganizationDependencies Error:", error.message);
    res.status(500).json({ 
      error: "Failed to retrieve organization dependencies",
      details: error.message 
    });
  }
};

// Cascade delete organization and all its dependencies
export const cascadeDeleteOrganization = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.startTransaction();
    
    const { organizationId } = req.params;

    // Validate organization ID
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      await session.abortTransaction();
      return res.status(400).json({ 
        error: "Invalid organization ID format" 
      });
    }

    // Check if organization exists
    const organization = await Organization.findById(organizationId).session(session);
    if (!organization) {
      await session.abortTransaction();
      return res.status(404).json({ 
        error: "Organization not found" 
      });
    }

    // Store deletion summary for response
    const deletionSummary = {
      organization: {
        _id: organization._id,
        name: organization.name,
        abbreviation: organization.abbreviation
      },
      deletedItems: {
        events: 0,
        faqs: 0,
        authorityReferences: 0,
        categoryReferences: 0
      }
    };

    // Delete all events associated with this organization
    const deletedEvents = await Event.deleteMany({ 
      organization_id: organizationId 
    }).session(session);
    deletionSummary.deletedItems.events = deletedEvents.deletedCount;

    // Delete all FAQs associated with this organization
    const deletedFaqs = await FAQ.deleteMany({ 
      organizationId: organizationId 
    }).session(session);
    deletionSummary.deletedItems.faqs = deletedFaqs.deletedCount;

    // Remove organization reference from authorities
    const updatedAuthorities = await Authority.updateMany(
      { organizations: organizationId },
      { $pull: { organizations: organizationId } }
    ).session(session);
    deletionSummary.deletedItems.authorityReferences = updatedAuthorities.modifiedCount;

    // Remove organization reference from categories
    const updatedCategories = await Category.updateMany(
      { organizations: organizationId },
      { $pull: { organizations: organizationId } }
    ).session(session);
    deletionSummary.deletedItems.categoryReferences = updatedCategories.modifiedCount;

    // Finally, delete the organization itself
    await Organization.findByIdAndDelete(organizationId).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.status(200).json({
      message: "Organization and all dependencies deleted successfully",
      data: deletionSummary
    });

  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    console.error("cascadeDeleteOrganization Error:", error.message);
    res.status(500).json({ 
      error: "Failed to delete organization and dependencies",
      details: error.message 
    });
  } finally {
    // End the session
    await session.endSession();
  }
};

// Update organization with validation
export const updateOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const updates = req.body;

    // Validate organization ID
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return res.status(400).json({ 
        error: "Invalid organization ID format" 
      });
    }

    // Check if organization exists
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ 
        error: "Organization not found" 
      });
    }

    // Validate required fields if provided
    if (updates.name && typeof updates.name !== 'string') {
      return res.status(400).json({ 
        error: "Organization name must be a string" 
      });
    }

    if (updates.abbreviation && typeof updates.abbreviation !== 'string') {
      return res.status(400).json({ 
        error: "Organization abbreviation must be a string" 
      });
    }

    // Handle category lookup if category is provided as a string
    if (updates.category && typeof updates.category === 'string') {
      const categoryDoc = await Category.findOne({ category: updates.category });
      if (categoryDoc) {
        updates.category = categoryDoc._id;
      } else {
        return res.status(400).json({ 
          error: `Category '${updates.category}' not found` 
        });
      }
    }

    // Update the organization
    const updatedOrganization = await Organization.findByIdAndUpdate(
      organizationId,
      { 
        ...updates,
        updatedAt: new Date()
      },
      { 
        new: true, 
        runValidators: true,
        populate: { path: 'category', select: 'category description' }
      }
    );

    res.status(200).json({
      message: "Organization updated successfully",
      organization: updatedOrganization
    });

  } catch (error) {
    console.error("updateOrganization Error:", error.message);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation failed",
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({ 
      error: "Failed to update organization",
      details: error.message 
    });
  }
};
