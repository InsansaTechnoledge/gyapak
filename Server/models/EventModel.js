import mongoose from 'mongoose';


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
        type: Date,
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
        ref:"Organization",
        required: true
    },

    briefDetails:{
        type: String,
        default: 'this is a default briefing'
    },
    event_type:{
        type:String,
        enum:["Exam","AdmitCard","Result"],
        required: true
    }
},{
    timestamps: true
});

const Event = mongoose.model('Event', EventSchema);
export default Event;
