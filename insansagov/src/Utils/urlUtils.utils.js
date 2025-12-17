import slugGenerator from './SlugGenerator';

/**
 * Generates a slug-based URL with the ID embedded at the end
 * Format: /base-path/event-name-slug--{id}
 * 
 * @param {string} title - The title to convert to slug
 * @param {string} id - The MongoDB ID
 * @param {string} basePath - The base path (default: '/top-exams-for-government-jobs-in-india')
 * @returns {string} - The complete slug-based URL
 * 
 * Example:
 * generateSlugUrl('SSC CGL 2024', '507f1f77bcf86cd799439011')
 * Returns: '/top-exams-for-government-jobs-in-india/ssc-cgl-2024--507f1f77bcf86cd799439011'
 */
export const generateSlugUrl = (title, id, basePath = '/top-exams-for-government-jobs-in-india') => {
  if (!title || !id) {
    console.error('generateSlugUrl: title and id are required');
    return basePath;
  }
  
  const slug = slugGenerator(title);
  return `${basePath}/${slug}--${id}`;
};

/**
 * Extracts the ID from a slug-based URL
 * Format: event-name-slug--{id}
 * 
 * @param {string} slug - The full slug containing the ID
 * @returns {string|null} - The extracted ID or null if not found
 * 
 * Example:
 * extractIdFromSlug('ssc-cgl-2024--507f1f77bcf86cd799439011')
 * Returns: '507f1f77bcf86cd799439011'
 */
export const extractIdFromSlug = (slug) => {
  if (!slug) return null;
  
  // Split by double hyphen to separate slug from ID
  // Format: "event-name-slug--507f1f77bcf86cd799439011"
  const parts = slug.split('--');
  
  if (parts.length < 2) {
    // Fallback: try single hyphen for backward compatibility
    const singleHyphenParts = slug.split('-');
    const lastPart = singleHyphenParts[singleHyphenParts.length - 1];
    
    if (lastPart && lastPart.length === 24 && /^[a-f0-9]{24}$/i.test(lastPart)) {
      return lastPart;
    }
    return null;
  }
  
  // Get the ID part (everything after the last --)
  const idPart = parts[parts.length - 1];
  
  // Validate it's a MongoDB ObjectId (24 hex characters)
  if (idPart && idPart.length === 24 && /^[a-f0-9]{24}$/i.test(idPart)) {
    return idPart;
  }
  
  return null;
};
