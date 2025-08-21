import fetch from 'node-fetch';
if(process.env.NODE_ENV !== "production"){
    (await import('dotenv')).config();
  }
import mongoose from "mongoose";
const CLIENT_BASE_URL_LIVE = process.env.DEFAULT_LOGO;
let base64String = "";
try{
    const response = await fetch(CLIENT_BASE_URL_LIVE);
    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
     base64String = imageBuffer.toString('base64');
}catch(error){
    console.error('Error fetching image:', error);
}

const organizationSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    abbreviation:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    logo:{
        type: String,
        default:base64String
    },
    events:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    calendar:{
        type: String
    }
    
});

const Organization = mongoose.model('Organization', organizationSchema);
export default Organization;