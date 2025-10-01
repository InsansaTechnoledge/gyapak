import axios from 'axios';

const API_BASE_URL="https://admin.harshvaidya.tech" || "https://gyapak-admin2.onrender.com";
// const API_BASE_URL = "http://localhost:3000";


// Fetch landing page FAQs 
export const getLandingFAQs = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const url = params ? `${API_BASE_URL}/api/v1i2/faq?${params}` : `${API_BASE_URL}/api/v1i2/faq`;

  const response = await axios.get(url);

  return response.data;
};

// Fetch organization-specific FAQs
export const getOrganizationFAQs = async (orgId, filters = {}) => {
  if (!orgId) throw new Error('Organization ID is required');

  const params = new URLSearchParams(filters).toString();
  const url = `${API_BASE_URL}/api/v1i2/faq/org/${orgId}${params ? `?${params}` : ''}`;

  const response = await axios.get(url);
  return response.data;
};
