import EventType from "../models/EventTypeModel.js";
import Event from "../models/EventModel.js";
import Organization from "../models/OrganizationModel.js";

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createEventType=async(req,res)=>{
    try{
        const eventTypes=req.body;
        if(!Array.isArray(eventTypes)||eventTypes.length===0){
            return res.status(400).json({error:"Invalid input. 'eventTypes' should be a non-empty array."});
        }
        const eventTypesArray=await createOrUpdateEventTypes(eventTypes);
        res.status(201).json({message:"Event type created sucessfully!!",eventTypesArray});

    }catch(error){
        res.status(409).json({message:error.message});
    }
};

export const createEventTypeFunction=async()=>{
    try{
        const filePath=path.resolve(__dirname,`../data/eventTypeData.json`);
        if (!fs.existsSync(filePath)) {
            console.log(`Event type data file not found at path: ${filePath}`);
            return [];
        }
        const data=fs.readFileSync(filePath,'utf-8');
        const eventTypes=await createOrUpdateEventTypes(JSON.parse(data));
        return eventTypes;
    }catch(error){
        console.log(`Error in createEventTypeFunction: ${error.message}`);
        throw new Error(`Error in createEventTypeFunction: ${error.message}`);
    }
};
export const createOrUpdateEventTypes=async(eventTypes)=>{
    try{
        const eventTypesArray=[];
        for(let eventType of eventTypes){
            const x=await EventType.findOne({type:eventType});
            if(x){
                eventTypesArray.push(x);
                x.lastUpdated=Date.now();
                continue;
            }
            else{
            const newEventType=new EventType({
                type:eventType
            });
            await newEventType.save();
            eventTypesArray.push(newEventType);
        }
        }
        return eventTypesArray;
    }catch(error){
        console.log(`Error in createOrUpdateEventTypes: ${error.message}`);
        throw new Error(`Error in createOrUpdateEventTypes: ${error.message}`);
    }
};

//update the new events 
export const updateEvents=async(req,res)=>{
    try{
        
    }catch(error){
        res.status(409).json({message:error.message});
    }
};

export const createOrUpdateEvent=async(event,parent_organization)=>{
    try{
        const organization=await Organization.findOne({abbreviation:parent_organization});
        const newEvent=new Event({
                                    name:event.name,
                                    date_of_notification:event.date_of_notification,
                                    date_of_commencement:event.date_of_commencement,
                                    end_date:event.end_date,
                                    apply_link:event.apply_link,
                                    document_links:event.document_links,
                                    details:event.details,
                                    organization_id:organization._id,
                                    event_type:event.event_type
                                  });
                                  
                                  await newEvent.save();
                                  if (!organization.events.includes(newEvent._id)) {
                                    organization.events.push(newEvent._id);
                                  
                                }
                                await organization.save();
                                let eventType=await EventType.findOne({type:event.event_type});
                                                    eventType.events.push(newEvent._id); 
                                                    await eventType.save();


                                return newEvent;
    }catch(error){
        console.log(`Error in createOrUpdateEvent: ${error.message}`);
        throw new Error(`Error in createOrUpdateEvent: ${error.message}`);
    }

};

export const createEventFunction=async()=>{
    try{
        const formattedDataPath=path.resolve(__dirname,`../data/Formatted_data`);
        const filesAndFolders=fs.readdirSync(formattedDataPath);
        console.log(`Processing files in ${formattedDataPath}...`);

        for(let item of filesAndFolders){
            
        }

        
    }catch(error){
        console.log(`Error in createEventFunction: ${error.message}`);
        throw new Error(`Error in createEventFunction: ${error.message}`);
    }

};

export const addEvent=async(req,res)=>{
    try{
        const event=req.body;
        if(!event){
            return res.status(400).json({error:"Invalid input. 'event' should be a non-empty object."});
        }
        const newEvent=await createOrUpdateEvent(event);
        res.status(201).json({message:"Event created sucessfully!!",newEvent});
    }catch(error){
        res.status(409).json({message:error.message});
    }
};


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


//export const processOrganizationFiles = async (req, res) => {
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
