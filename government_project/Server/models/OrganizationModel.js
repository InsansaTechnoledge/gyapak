import fetch from 'node-fetch';
if(process.env.NODE_ENV !== "production"){
    (await import('dotenv')).config();
  }
import mongoose from "mongoose";
const imageUrl = process.env.DEFAULT_LOGO;
let base64String = "";
try {
    const validUrl = new URL(imageUrl); // Validate URL first
    const response = await fetch(validUrl.href);
    const imageBuffer = await response.arrayBuffer();
     base64String = Buffer.from(imageBuffer).toString('base64');
} catch (error) {
    console.log("Fetch Error:", error);
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
    }
    
});

const Organization = mongoose.model('Organization', organizationSchema);
export default Organization;