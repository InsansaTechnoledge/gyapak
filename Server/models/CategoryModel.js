import mongoose from "mongoose";
import {DEFAULT_LOGO} from '../config/env.js';
import fetch from 'node-fetch';
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

const CategorySchema = new mongoose.Schema({
    category:{
        type: String,
        required: true
    },
    organizations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization"
        }
    ],
    logo:{
        type: String,
        default:base64String
    }

});

const Category = mongoose.model('Category', CategorySchema);
export default Category;