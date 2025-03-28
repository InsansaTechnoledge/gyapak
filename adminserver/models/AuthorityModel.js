import fetch from 'node-fetch';
import mongoose from "mongoose";
if(process.env.NODE_ENV !== "production"){
    (await import('dotenv')).config();
  }
const imageUrl = process.env.DEFAULT_LOGO;
let base64String = "";
try{
    const response = await fetch(imageUrl);
    const imageBuffer = await response.buffer();
     base64String = imageBuffer.toString('base64');
}catch(error){
    console.error('Error fetching image:', error);
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