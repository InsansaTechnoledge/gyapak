import EventType from "../models/EventTypeModel.js";
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

