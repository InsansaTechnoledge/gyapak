import mongoose from "mongoose";
if(process.env.NODE_ENV !== "production"){
    (await import('dotenv')).config();
  }
import fetch from 'node-fetch';
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