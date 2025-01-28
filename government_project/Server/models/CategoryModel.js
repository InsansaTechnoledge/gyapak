import mongoose from "mongoose";
if(process.env.NODE_ENV !== "production"){
    (await import('dotenv')).config();
  }
import fetch from 'node-fetch';
const imageUrl = process.env.DEFAULT_LOGO;
const response = await fetch(imageUrl);
const imageBuffer = await response.arrayBuffer();
const base64String =Buffer.from(imageBuffer).toString('base64');

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