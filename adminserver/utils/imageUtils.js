import fetch from 'node-fetch';

/**
 * Convert file buffer to base64 string
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} mimeType - The MIME type of the file
 * @returns {string} - Base64 string with data URL prefix
 */
export const bufferToBase64 = (fileBuffer, mimeType) => {
    const base64 = fileBuffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
};

/**
 * Convert file buffer to base64 string without data URL prefix
 * @param {Buffer} fileBuffer - The file buffer
 * @returns {string} - Base64 string
 */
export const bufferToBase64Raw = (fileBuffer) => {
    return fileBuffer.toString('base64');
};

/**
 * Convert image URL to base64 string
 * @param {string} imageUrl - The URL of the image
 * @returns {Promise<string>} - Base64 string
 */
export const urlToBase64 = async (imageUrl) => {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);
        return imageBuffer.toString('base64');
    } catch (error) {
        console.error('Error converting URL to base64:', error);
        throw error;
    }
};

/**
 * Validate if the file is an image
 * @param {string} mimeType - The MIME type of the file
 * @returns {boolean} - True if it's an image
 */
export const isValidImage = (mimeType) => {
    const validImageTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml'
    ];
    return validImageTypes.includes(mimeType);
};

/**
 * Get default logo as base64
 * @returns {Promise<string>} - Base64 string of default logo
 */
export const getDefaultLogoBase64 = async () => {
    try {
        const defaultLogoUrl = process.env.DEFAULT_LOGO || 'https://default-logo-url.com';
        return await urlToBase64(defaultLogoUrl);
    } catch (error) {
        console.error('Error fetching default logo:', error);
        return "";
    }
};