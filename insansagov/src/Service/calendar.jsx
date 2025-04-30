// services/organization.js

import axios from 'axios';

export const fetchOrganizationByName = async (apiBaseUrl, name) => {
  const res = await axios.get(`${apiBaseUrl}/api/organization/${name}`);
  return res.data.organization; // contains logo, abbreviation, name, etc.
};
