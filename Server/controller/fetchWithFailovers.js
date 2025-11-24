const API_URLS = [
  "https://adminpanel.gyapak.in",
  "https://gyapak-2.onrender.com",
  "https://gyapak.onrender.com",
  "https://gyapak-3.onrender.com",
  "http://localhost:3000"
];

// Initial index to start with first URL
let currentUrlIndex = 0;

/**
 * Gets the current API base URL
 * @returns {string} Current API base URL
 */
const getApiBaseUrl = () => {
  return API_URLS[currentUrlIndex];
};

/**
 * Switches to the next available API URL
 * @returns {string} The next API URL
 */
const switchToNextUrl = () => {
  currentUrlIndex = (currentUrlIndex + 1) % API_URLS.length;
  return getApiBaseUrl();
};

/**
 * Makes an API request with automatic fallback if a server fails
 * @param {string} endpoint - API endpoint to call
 * @param {Object} options - Fetch options
 * @param {number} [retryCount=0] - Current retry count
 * @returns {Promise} - Promise resolving to the API response
 */
const fetchWithFallback = async (endpoint, options = {}, retryCount = 0) => {
  // Stop if we've tried all servers
  if (retryCount >= API_URLS.length) {
    throw new Error("All API servers are unavailable");
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, options);
    
    if (!response.ok) {
      // For 5xx server errors, try the next server
      if (response.status >= 500) {
        console.warn(`Server error (${response.status}) on ${getApiBaseUrl()}, trying next server...`);
        switchToNextUrl();
        return fetchWithFallback(endpoint, options, retryCount + 1);
      }
      
      // For other errors, let the caller handle them
      return response;
    }
    
    return response;
  } catch (error) {
    // Network errors (server down/unreachable) trigger a fallback
    console.warn(`Network error with ${getApiBaseUrl()}: ${error.message}, trying next server...`);
    switchToNextUrl();
    return fetchWithFallback(endpoint, options, retryCount + 1);
  }
};

export { getApiBaseUrl, switchToNextUrl, fetchWithFallback };