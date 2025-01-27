import express from 'express';
import cors from 'cors';
import routes from '../routes/routes.js';

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.CLIENT_BASE_URL_LOCAL,  
  process.env.CLIENT_BASE_URL_LIVE,
  "https://gyapak.vercel.app"
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) { // Allow requests with no origin (e.g., Postman, curl)
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// This will handle preflight requests without needing a separate options handler
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || process.env.CLIENT_BASE_URL_LIVE);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(204).send();
});

// Parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your routes
routes(app);

export default app;
