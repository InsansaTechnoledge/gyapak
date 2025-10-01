import Organization from "../models/OrganizationModel.js";
import Authority from "../models/AuthorityModel.js";

// Create a simple Category schema since it doesn't exist
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
});

const Category = mongoose.model("Category", CategorySchema);

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

      // Create new organization
      const newOrg = new Organization({
        name: org.name,
        abbreviation: org.abbreviation,
        description: org.description,
        category: category._id,
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
