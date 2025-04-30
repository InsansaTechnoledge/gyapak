// services/organization.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8383'; 

export const fetchAllOrganizations = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/organization/all`);
  return res.data; 
};

export const fetchOrganizationByName = async (name) => {
  const res = await axios.get(`${API_BASE_URL}/api/organization/${name}`);
  return res.data.organization; 
};
