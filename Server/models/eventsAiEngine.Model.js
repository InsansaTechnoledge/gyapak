import {Schema , model} from 'mongoose'


const proctorEventSchema = new Schema({
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',  
      required: true 
    },
    examId: { type: String, required: true },
    eventType: { type: String, required: true },
    timestamp: { type: String, required: true }, 
    details: { type: String, required: true }
  }, { timestamps: true });
  
  const ProctorEvent = model('ProctorEvent', proctorEventSchema);
  
  export default ProctorEvent;