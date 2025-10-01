import mongoose from "mongoose";
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Function to get default logo as base64
export const getDefaultLogoBase64 = async () => {
    try {
        const CLIENT_BASE_URL_LIVE = process.env.DEFAULT_LOGO || 'https://default-logo-url.com';
        const response = await fetch(CLIENT_BASE_URL_LIVE);
        const arrayBuffer = await response.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);
        return imageBuffer.toString('base64');
    } catch (error) {
        console.error('Error fetching default logo:', error);
        return "";
    }
};

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    abbreviation: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    logo: {
        type: String, // Will store base64 string
        default: ""
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    calendar: {
        type: String
    }
});

const Organization = mongoose.model('Organization', organizationSchema);
export default Organization;