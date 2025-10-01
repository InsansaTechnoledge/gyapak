import mongoose from "mongoose";
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use DEFAULT_LOGO from environment variables with fallback
const imageUrl = process.env.DEFAULT_LOGO || 'https://thumbs.dreamstime.com/z/not-found-icon-design-line-style-perfect-application-web-logo-presentation-template-not-found-icon-design-line-style-169941512.jpg';

// Function to get base64 image
async function getDefaultLogoBase64() {
    try {
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);
        return imageBuffer.toString('base64');
    } catch (error) {
        console.error('Error fetching image:', error);
        return ""; // Return empty string as fallback
    }
}

const CategorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    organizations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization"
        }
    ],
    logo: {
        type: String,
        default: "" // Will be set by the application logic if needed
    }

});

const Category = mongoose.model('Category', CategorySchema);

// Export both the model and the helper function
export default Category;
export { getDefaultLogoBase64 };