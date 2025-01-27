import EventType from '../models/EventTypeModel.js';
import Subscriber from '../models/SubscriberModel.js';
import {updateMail} from '../controller/subscriberController.js';

export const startChangeStream = async () => {
    try{
        console.log("conncted mongodb for the scheduler");
        const update=EventType.watch(
            [
                {
                    $match: {
                        "fullDocument.type": "update"  // Matching changes where 'type' is 'update'
                    }
                }
            ], 
            { fullDocument: "updateLookup" }
        );
        update.on('change',async(change)=>{
        
            const users=await Subscriber.find({isSubscribed:true});
            users.forEach(async user => {
                try{
                
                    await updateMail(user.email,user.name,user.unsubscribeToken);
                    
                }catch(error){
                    console.error('Error sending email:', error);
                }
            });
            console.log("Emails sent to all subscribers");

        });

    }catch(error){
        console.error('Error starting change stream:', error);
        res.status(500).json({message: "Internal Server Error"});
    }
};