import mongoose from "mongoose";

const EventTypeSchema = new mongoose.Schema({
    type:{
        type: String,
        enum:["Exam","AdmitCard","Result","update"],
    },
    events:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    lastUpdated:{
        type: Date,
        default: Date.now()
    }

});

const EventType = mongoose.model('EventType', EventTypeSchema);
export default EventType;