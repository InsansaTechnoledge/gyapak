const nodeEnv = 'development';

if (nodeEnv !== 'production') {
  const dotenv = await import('dotenv');
  dotenv.config({ path: `./.env.${nodeEnv}.local` });
}

export const {
    PORT,
    MONGO_URI,
     
    CLIENT_BASE_URL_LOCAL,
    CLIENT_BASE_URL_LIVE,
     
    DEFAULT_LOGO,
     
     
    NODE_ENV,
 
    EMAIL1,
    PASSWORD1,
    EMAIL,
    PASSWORD,
    
    
    RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET,
  } = process.env;
  
  export default nodeEnv;