import fetch from 'node-fetch';
if(process.env.NODE_ENV !== "production"){
    (await import('dotenv')).config();
  }
import mongoose from "mongoose";
const imageUrl = process.env.DEFAULT_LOGO;
const response = await fetch(imageUrl);
const imageBuffer = await response.arrayBuffer();
const base64String = Buffer.from(imageBuffer).toString('base64');

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