import fetch from 'node-fetch';
import mongoose from "mongoose";
if(process.env.NODE_ENV !== "production"){
    (await import('dotenv')).config();
  }
const imageUrl = process.env.DEFAULT_LOGO;
const response = await fetch(imageUrl);
const imageBuffer = await response.arrayBuffer();
const base64String = Buffer.from(imageBuffer).toString('base64');

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