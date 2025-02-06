import EventType from "../models/EventTypeModel.js";
import Event from "../models/EventModel.js";
import Organization from "../models/OrganizationModel.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createEventType = async (req, res) => {
    try {
        const eventTypes = req.body;
        if (!Array.isArray(eventTypes) || eventTypes.length === 0) {
            return res.status(400).json({ error: "Invalid input. 'eventTypes' should be a non-empty array." });
        }
        const eventTypesArray = await createOrUpdateEventTypes(eventTypes);
        res.status(201).json({ message: "Event type created sucessfully!!", eventTypesArray });

    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const createEventTypeFunction = async () => {
    try {
        const filePath = path.resolve(__dirname, `../data/eventTypeData.json`);
        if (!fs.existsSync(filePath)) {
            console.log(`Event type data file not found at path: ${filePath}`);
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf-8');
        const eventTypes = await createOrUpdateEventTypes(JSON.parse(data));
        return eventTypes;
    } catch (error) {
        console.log(`Error in createEventTypeFunction: ${error.message}`);
        throw new Error(`Error in createEventTypeFunction: ${error.message}`);
    }
};

export const createOrUpdateEventTypes = async (eventTypes) => {
    try {
        const eventTypesArray = [];
        for (let eventType of eventTypes) {
            const x = await EventType.findOne({ type: eventType });
            if (x) {
                eventTypesArray.push(x);
                x.lastUpdated = Date.now();
                continue;
            }
            else {
                const newEventType = new EventType({
                    type: eventType
                });
                await newEventType.save();
                eventTypesArray.push(newEventType);
            }
        }
        return eventTypesArray;
    } catch (error) {
        console.log(`Error in createOrUpdateEventTypes: ${error.message}`);
        throw new Error(`Error in createOrUpdateEventTypes: ${error.message}`);
    }
};

export const createOrUpdateEvent = async (event, parent_organizationId) => {
    try {
        const newEvent = new Event({
            name: event.name,
            date_of_notification: event.date_of_notification,
            date_of_commencement: event.date_of_commencement,
            end_date: event.end_date,
            apply_link: event.apply_link,
            document_links: event.document_links,
            details: event.details,
            organization_id:parent_organizationId,
            event_type: event.event_type
        });

        await newEvent.save();
        let eventType = await EventType.findOne({ type: event.event_type });
        eventType.events.push(newEvent._id);
        await eventType.save();


        return newEvent;
    } catch (error) {
        console.log(`Error in createOrUpdateEvent: ${error.message}`);
        throw new Error(`Error in createOrUpdateEvent: ${error.message}`);
    }

};

export const addEvent = async (req, res) => {
    try {
        const { event, parent_organization } = req.body;
        if (!event) {
            return res.status(400).json({ error: "Invalid input. 'event' should be a non-empty object." });
        }
        const parent=await Organization.findOne({abbreviation:parent_organization});
        const newEvent = await createOrUpdateEvent(event, parent._id);
        res.status(201).json({ message: "Event created sucessfully!!", newEvent });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

//updates are the araay of the file paths of upadted events in the data
export const addEventFunction = async (updates) => {
    try{
        const formattedDataPath=path.resolve(__dirname,`../data/Formatted_data`);
        for(const update of updates){
            const filePath=path.resolve(formattedDataPath,update);
            const dirName=path.basename(path.dirname(filePath));
            await processFile(filePath,path.basename(filePath),dirName);
        }

        await EventType.findOneAndUpdate(
            {type:"update"},
            {$set:{lastUpdated:Date.now()}},
            {new:true});
    }catch(error){
        console.log(`Error in addEventFunction: ${error.message}`);
        throw new Error(`Error in addEventFunction: ${error.message}`);
    }
};

export const addAllEvents = async () => {
    try{
        await Organization.updateMany({},{$set:{events:[]}});
        await EventType.updateMany({},{$set:{events:[]}});
        await Event.deleteMany({});

        const formattedDataPath=path.resolve(__dirname,`../data/Formatted_data`);
        console.log("processing data from: ",formattedDataPath);

        await processDirectory(formattedDataPath,path.basename(formattedDataPath));

        await EventType.findOneAndUpdate(
            {type:"update"},
            {$set:{lastUpdated:Date.now()}},
            {new:true});

    }catch(error){
        console.log(`Error in addAllEvents: ${error.message}`);
        throw new Error(`Error in addAllEvents: ${error.message}`);
    }
};

export const processDirectory=async (dirPath,dirName)=>{
    try{
        const filesAndFolders=fs.readdirSync(dirPath);
        console.log("processing files and folders: ",filesAndFolders);

        for(const item of filesAndFolders){
            const itemPath=path.resolve(dirPath,item);
            const stats=fs.statSync(itemPath);

            if(stats.isDirectory()){
                await processDirectory(itemPath,item);
            }else if(stats.isFile() && item.endsWith(".json")){
                await processFile(itemPath,item,dirName);
            }
        }
    }catch(error){
        console.log(`Error in processDirectory: ${error.message}`);
        throw new Error(`Error in processDirectory: ${error.message}`);
    }
};

export const processFile=async (filePath,fileName,dirName)=>{
    try{
        console.log("processing file: ",fileName);
        const fileContent=fs.readFileSync(filePath,'utf-8');
        if(!fileContent.trim()){
            console.log("File is empty");
            return;
        }
        const eventData=JSON.parse(fileContent);
        const parentOrganization=fileName.split(".")[0];
        let organization=await Organization.findOne({abbreviation:parentOrganization});
        if(!organization){
            console.log(`Organization with abbreviation ${parentOrganization} not found`);
            organization = await Organization.findOne({ abbreviation: 'UPSC' });
        }
        let organization1=null;
        if(organization && dirName==='UPSC'){
            organization1 = await Organization.findOne({ abbreviation: 'UPSC' });
        }
        for(const event of eventData){
            const savedEvent=await createOrUpdateEvent(event,organization._id);

            if (!organization.events.includes(savedEvent._id)) {
                organization.events.push(savedEvent._id);
    
            }
            await organization.save();
            if(organization1 && !organization1.events.includes(savedEvent._id)){
                organization1.events.push(savedEvent._id);
                await organization1.save();
            }
        }

        fs.writeFileSync(filePath, '', 'utf8'); 
        console.log(`File ${fileName} cleared successfully.`);
        
    }catch(error){
        console.log(`Error in processFile: ${error.message}`);
        throw new Error(`Error in processFile: ${error.message}`);
    }
};
