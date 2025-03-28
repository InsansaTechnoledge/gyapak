import Authority from "../models/AuthorityModel.js";

export const getStateList = async (req,res) => {
    try{

        const states = await Authority.find({type:"State_Government"},{
            _id:1,
            name:1
        });
        
        // const stateList = states.map(state => state.name);
        
        res.status(200).json(states);
    }
    catch(err){
        console.log(err);
        res.status(400).json("List not available");
    }
}