import axios from 'axios'
import { IPSTAC_ACCESS_KEY } from '../../config/env.js'

export const getGeoLocationFromIp = async (ip) => {
    try {
      const accessKey = IPSTAC_ACCESS_KEY;
      console.log("🌐 IP to lookup:", ip);
  
      const response = await axios.get(`http://api.ipstack.com/${ip}?access_key=${accessKey}`);
      console.log("📡 Raw IPStack Response:", response.data);
  
      const { latitude, longitude } = response.data;
  
      if (!latitude || !longitude) {
        console.warn('⚠️ No geolocation found from IPStack');
        return null;
      }
  
      return {
        type: 'Point',
        coordinates: [longitude, latitude]
      };
    } catch (e) {
      console.error('❌ IPStack Geo Error:', e.message);
      return null;
    }
  };
  