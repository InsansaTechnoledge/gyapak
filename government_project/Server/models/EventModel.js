import mongoose from 'mongoose';
if(process.env.NODE_ENV !== "production"){
    (await import('dotenv')).config();
}

const EventSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    date_of_notification:{
        type: String,
    },
    date_of_commencement:{
        type: String,
    },
    end_date:{
        type: String,
    },
    apply_link:{
            type: String,
    },
    document_links:[{
        type: String,
       
    }],
    details:{
        type:Object,
    },
    organization_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Organization"
    },
    event_type:{
        type:String,
        enum:["Exam","AdmitCard","Result"]
    }
});

const Event = mongoose.model('Event', EventSchema);
export default Event;
