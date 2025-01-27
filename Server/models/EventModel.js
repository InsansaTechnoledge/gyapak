import mongoose from 'mongoose';
if(process.env.NODE_ENV !== "production"){
    (await import('dotenv')).config();
}

const EventSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    date_of_notification:{
        type: String,
        required: true
    },
    date_of_commencement:{
        type: String,
        required: true
    },
    end_date:{
        type: String,
        required: true
    },
    apply_link:{
            type: String,
            required: true
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
