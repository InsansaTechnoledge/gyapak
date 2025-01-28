import Organization from '../models/OrganizationModel.js';
import Category from '../models/CategoryModel.js';
import Authority from '../models/AuthorityModel.js';
import Event from '../models/EventModel.js';
import EventType from '../models/EventTypeModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path'; 
import { convertImageToBase64 } from '../config/imageConversion.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname); 

//this is for the events in the paticular organization  
// async function processFilesInFolder(folderPath, parentFolderName, type = null) {
//       try {
  
//           const filesAndFolders = fs.readdirSync(folderPath);
//           console.log(`Processing files in ${folderPath}...`);
  
//           for (let item of filesAndFolders) {
//               const itemPath = path.join(folderPath, item);
//               const stats = fs.statSync(itemPath);
  
//               if (stats.isDirectory()) {
//                   await processFilesInFolder(itemPath, item, type);  
//               }
  
//               if (stats.isFile() && item.endsWith('.json')) {
//                   console.log(`Processing file: ${item}`);
  
  
//                   const fileData = JSON.parse(fs.readFileSync(itemPath, 'utf8'));
//                   const organizationName = item.split('.')[0];  
//                   const organizationInfo = fileData;  
//                   // console.log(organizationInfo);
  
//                   let organization = await Organization.findOne({ abbreviation: organizationName });
  
//                   // If the organization does not exist, create it
//                   if (!organization && parentFolderName==='UPSC') {
//                       organization=await Organization.findOne({abbreviation:'UPSC'});
//                       };
//                       let organization1='';
//                   if(organization && parentFolderName==='UPSC'){
//                      organization1=await Organization.findOne({abbreviation:'UPSC'});
//                   }
//                   for(let event of  organizationInfo){
//                     console.log(event);
//                     const x=await Event.findOne({name:event.name});
//                     if(x){
//                       // res.status(400).json({error:`Event already exists`});
//                       console.log("Event already exists from the :" , organizationName);
//                     }
//                     else{
//                       const newEvent=new Event({
//                         name:event.name,
//                         date_of_notification:event.date_of_notification,
//                         date_of_commencement:event.date_of_commencement,
//                         end_date:event.end_date,
//                         apply_link:event.apply_link,
//                         document_links:event.document_links,
//                         details:event.details,
//                         organization_id:organization._id,
//                         event_type:event.event_type
//                       });
//                       // console.log(newEvent);
                      
//                       await newEvent.save();
//                       if (!organization.events.includes(newEvent._id)) {
//                         organization.events.push(newEvent._id);
                      
//                     }
//                     await organization.save();

//                     if(organization1 && parentFolderName==='UPSC' && !organization1.events.includes(newEvent._id)){
//                       organization1.events.push(newEvent._id);
//                       await organization1.save();
//                     }
                    
//                     let eventType=await EventType.findOne({type:event.event_type});
//                     eventType.events.push(newEvent._id); 
//                     await eventType.save();
//                     }
//                      }
//                   }
//               }
          
//       } catch (error) {
//           console.error("Error processing files in folder", folderPath, error);
//       }
//   }
  
  
//   export const processOrganizationFiles = async (req, res) => {
//       try {
//           const formattedDataPath = path.join(__dirname, '../../formatted_data');
  
//           const baseDirectories = ['Central', 'States', 'Multiple'];
  
//           // Loop through each base folder and process the files
//           for (const baseDir of baseDirectories) {
//               const folderPath = path.join(formattedDataPath, baseDir);  
  
//               console.log(`Processing files in ${baseDir} folder...`);
  
//               if (baseDir === 'States') {
//                   // Process states subfolders dynamically
//                   const stateFolders = fs.readdirSync(folderPath).filter(item => fs.statSync(path.join(folderPath, item)).isDirectory());
//                   for (const state of stateFolders) {
//                       const stateFolderPath = path.join(folderPath, state);
  
//                       console.log(`Processing files in ${state} folder...`);
  
//                       await processFilesInFolder(stateFolderPath, state, 'State_Government');
  
//                   }
//               } 
//               else if (baseDir === 'Multiple') {
//                   const multipleFolders = fs.readdirSync(folderPath).filter(item => fs.statSync(path.join(folderPath, item)).isDirectory());
//                   for (const folder of multipleFolders) {
//                       const multipleFolderPath = path.join(folderPath, folder);
//                       await processFilesInFolder(multipleFolderPath, folder, 'Multiple_Organizations');
//                   }
//               } else {
//                   console.log(`Processing files in ${baseDir} folder...`, folderPath);
//                   await processFilesInFolder(folderPath, baseDir, 'Central_Government');
//               }
//           }
//           await EventType.findOneAndUpdate(
//             {type:"update"},
//             { $set:{lastUpdated:Date.now()}},
//             { new: true }
//           );
//           res.status(200).json({ message: 'Files processed and organizations updated' });
//       } catch (error) {
//           console.error("Error in processing organization files:", error);
//           res.status(500).json({ error: 'Failed to process organization files' });
//       }
//   };

//   export const updateLogos = async (req,res) => {
//   const folderPath = path.join(__dirname, '..' , 'OrganizationLogos');  // Folder containing the PNG files
//   console.log(folderPath);

//   fs.readdir(folderPath, async (err, files) => {
//     console.log(files);
//     if (err) {
//       console.log('Error reading folder:', err);
//       return;
//     }

//     for (const file of files) {
//       if (path.extname(file) === '.png') {
//         const organizationName = path.basename(file, '.png');  // Extract the organization name from the filename
//         const filePath = path.join(folderPath, file);
//         const base64Image = await convertImageToBase64(filePath);
//         const updatedOrg = await Organization.findOneAndUpdate(
//           { abbreviation: organizationName }, 
//           { $set: { logo: base64Image } },
//           { new: true } 
//         );

//         if (updatedOrg) {
//           console.log(`Updated logo for ${organizationName}`);
//         } else {
//           console.log(`Organization ${organizationName} not found.`);
//         }
//       }

//     }
//     res.status(200).json({ message: 'Logo updated successfully' });

//   });
// };

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

export const updateOrganizationData = async (abbreviation, details) => {
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
      const updatedOrganization = await updateOrganizationData(details.abbreviation, details);
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

export const updateCategory = async (req, res) => {
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




