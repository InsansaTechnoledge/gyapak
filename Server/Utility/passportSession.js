import session from 'express-session';
import MongoStore from 'connect-mongo';
if(process.env.NODE_ENV !== "production"){
  (await import('dotenv')).config();
}


const passportsessionMiddleware = session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 1 * 24 * 60 * 60, // 1 day in seconds
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
    domain: process.env.NODE_ENV === 'development' ? 'localhost' : 'auto',
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
  },
});

export default passportsessionMiddleware;
