// const nodeEnv = 'development';
const nodeEnv='production';

  const dotenv = await import('dotenv');
  // dotenv.config({ path: `./.env.${nodeEnv}.local` });
  dotenv.config({ path: `./.env` });



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
  SESSION_KEY,
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  IPSTAC_ACCESS_KEY
} = process.env;

export default nodeEnv;