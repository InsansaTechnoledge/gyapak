import fetch from 'node-fetch';
import mongoose from "mongoose";
import { DEFAULT_LOGO } from '../config/env.js';
const imageUrl = DEFAULT_LOGO;
let base64String = "";
if (imageUrl && imageUrl.startsWith('http')) {
    try{
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);

        base64String = imageBuffer.toString('base64');
    }catch(error){
        console.error('Error fetching image:', error);
    }
}

const AuthoritySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    type:{
        type: String,
        enum: [ "State_Government", "Central_Government"],
        required: true,
    },
    organizations: [
        {
          type:mongoose.Schema.Types.ObjectId, 
          ref:"Organization"
        }
    ],
    logo:{
        type: String,
        default:base64String        
    },

});

const Authority = mongoose.model('Authority', AuthoritySchema);
export default Authority;