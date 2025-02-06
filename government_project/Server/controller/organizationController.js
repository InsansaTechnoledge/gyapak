import Organization from '../models/OrganizationModel.js';
import Category from '../models/CategoryModel.js';
import Authority from '../models/AuthorityModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path'; 
import { convertImageToBase64 } from '../config/imageConversion.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname); 

const readOrganizationDataFromFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading organization data from file: ${error.message}`);
  }
};

export const fetchLogo = async (organizationAbbreviation) => {
  try {
    const folderPath = path.join(__dirname, '../data/OrganizationLogos');
    const filePath = path.join(folderPath, `${organizationAbbreviation}.png`);

    if (!fs.existsSync(filePath)) {
      console.log(`Logo not found for ${organizationAbbreviation}, returning null.`);
      return null;  
    }

    const base64Logo = await convertImageToBase64(filePath);
    return base64Logo;

  } catch (error) {
    console.log(`Error processing logo for ${organizationAbbreviation}: ${error.message}`);
    return null;  
  }
};

export const saveOrganization = async (organizations) => {
  const savedOrganizations = [];

  for (let org of organizations) {
    const parent = await Authority.findOne({ name : org.parent_organization });
    if (!parent) {
      throw new Error(`Parent authority not found for ${org.name}`);
    }

    const category = await Category.findOne({ category: org.category });
    if (!category) {
      throw new Error(`Category not found for ${org.name}`);
    }

    const logo=await fetchLogo(org.abbreviation);

    const existingOrg = await Organization.findOne({ abbreviation: org.abbreviation });

    if (existingOrg) {
      existingOrg.name = org.name;
      existingOrg.description = org.description;
      existingOrg.logo = logo;
      await existingOrg.save();
    }
    else{

    const newOrg = new Organization({
      name: org.name,
      abbreviation: org.abbreviation,
      description: org.description,
      logo:logo,
      category: category._id,
    });
    await newOrg.save();
    savedOrganizations.push(newOrg);

    // Update relationships
    category.organizations.push(newOrg._id);
    await category.save();

    parent.organizations.push(newOrg._id);
    await parent.save();
  }
    
  }

  return savedOrganizations;
};

export const updateOrganizationFunction = async (abbreviation, details) => {
  const logo = await fetchLogo(abbreviation);
  return await Organization.findOneAndUpdate(
    { abbreviation },
    { $set: { ...details, logo } },
    { new: true }
  );
};

export const createOrganizations = async (req, res) => {
  try {
    const organizations = req.body;

    if (!Array.isArray(organizations)) {
      return res.status(400).json({ error: "Invalid input. Expected an array of organizations." });
    }

    const savedOrganizations = await saveOrganization(organizations);
    res.status(201).json({ message: "Organizations created successfully", savedOrganizations });
  } catch (error) {
    console.error("createOrganizations Error:", error.message);
    res.status(500).json({ error: "Failed to create organizations" });
  }
};

export const createOrganizationFunction=async()=>{
  try{
    const filePath = path.resolve(__dirname, '../data/organizationData.json'); 
    const organizationData = readOrganizationDataFromFile(filePath); 
    return await saveOrganization(organizationData); 
  } catch (error) {
    console.error(`Error in createOrganizationFunction: ${error.message}`);
    throw new Error(error.message);
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const { detailsArray } = req.body;

    if (!Array.isArray(detailsArray)) {
      return res.status(400).json({ error: "Invalid input. Expected an array of details." });
    }

    let updatedOrganizations = [];
    for (let details of detailsArray) {
      const updatedOrganization = await updateOrganizationFunction(details.abbreviation, details);
      if (!updatedOrganization) {
        return res.status(404).json({ error: `Organization with abbreviation ${details.abbreviation} not found` });
      }
      updatedOrganizations.push(updatedOrganization);
    }
    res.status(201).json({ message: "Organization updated successfully", updatedOrganization });
  } catch (error) {
    console.error("updateOrganization Error:", error.message);
    res.status(500).json({ error: "Failed to update organization" });
  }
};

export const updateOrganizationCategory = async (req, res) => {
  try {
    const { abbreviation, category } = req.body;

    const org = await Organization.findOne({ abbreviation: abbreviation });
    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    const oldCat = await Category.findOne({ _id: org.category });
    if (!oldCat) {
      return res.status(404).json({ error: "Old category not found" });
    }

    oldCat.organizations = oldCat.organizations.filter(id => id.toString() !== org._id.toString());
    await oldCat.save();  
  
    const newCat = await Category.findOne({ category: category });
    if (!newCat) {
      return res.status(404).json({ error: "Category not found" });
    }

    org.category = newCat._id;
    await org.save(); 
   
    if (!newCat.organizations.includes(org._id)) {
      newCat.organizations.push(org._id);
    }
    await newCat.save();  

    res.status(201).json({ message: "Category updated successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




