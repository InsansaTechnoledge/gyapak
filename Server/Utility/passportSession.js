import session from 'express-session';
import MongoStore from 'connect-mongo';
import { MONGO_URI, NODE_ENV, SESSION_KEY } from '../config/env.js';

const passportsessionMiddleware = session({
  secret: SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    collectionName: 'sessions',
    ttl: 1 * 24 * 60 * 60, // 1 day in seconds
  }),
  cookie: {
    httpOnly: true,
    secure: NODE_ENV !== 'development',
    sameSite: NODE_ENV === 'development' ? 'lax' : 'none',
    domain: NODE_ENV === 'development' ? 'localhost' : 'auto',
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
  },
});

export default passportsessionMiddleware;
