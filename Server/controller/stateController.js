import Authority from '../models/AuthorityModel.js'
import Organization from '../models/OrganizationModel.js'
import Event from '../models/EventModel.js'

export const getStateByName = async (req, res) => {
    try{

        const {name} = req.params;

        const stateData = await Authority.findOne({
            name: name
        });
        

        const organizationIds = stateData.organizations;
        
        const organizations = await Organization.find({
            _id: {$in: organizationIds}
        },{
            logo:1,
            abbreviation:1
        });

        res.status(201).json({stateData,organizations});
    }
    catch(err){
        console.log(err);
    }
} ;

export const getCountDetails=async (req,res)=>{
    try{
        const states=await Authority.countDocuments({type:"State_Government"});
        const exams=await Event.countDocuments({event_type:"Exam"});

        res.status(201).json({states:states,exams:exams});



    }catch(err){
        console.log("error occured: ",err);
        res.status(400).json({message:"Error occured",states:10,exams:100});
    }
}

export const getStateList = async (req,res) => {
    try{

        const states = await Authority.find({type:"State_Government"});
        
        const stateList = states.map(state => state.name);
        
        res.status(200).json(stateList);
    }
    catch(err){
        console.log(err);
        res.status(400).json("List not available");
    }
}

export const getMoreAuthorities = async (req,res) => {
    
    try{
        const authorities = await Authority.find({},{
            _id: 1,
            logo:1,
            name:1
        });
        
        res.status(201).json(authorities);
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
}