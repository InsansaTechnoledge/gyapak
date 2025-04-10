import fetch from 'node-fetch';
import {DEFAULT_LOGO} from '../config/env.js';
import mongoose from "mongoose";
const imageUrl = DEFAULT_LOGO;
let base64String = "";
try{
    const response = await fetch(imageUrl);
    const imageBuffer = await response.buffer();
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