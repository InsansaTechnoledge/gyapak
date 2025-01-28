import EventType from "../models/EventTypeModel.js";
import Event from "../models/EventModel.js";
import Organization from "../models/OrganizationModel.js";
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

export const createOrUpdateEvent=async(event)=>{
    try{
        const organization=await Organization.findOne({abbreviation:event.parent_organization});
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
                                  // console.log(newEvent);
                                  
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

}

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
}

