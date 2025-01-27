if(process.env.NODE_ENV !== "production"){
  (await import('dotenv')).config();
}
import express from 'express';
import routes from '../routes/routes.js';
import cors from 'cors';

const app=express();

app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.CLIENT_BASE_URL_LOCAL,  
  process.env.CLIENT_BASE_URL_LIVE,
  "https://gyapak.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) { // Allow requests with no origin (e.g., Postman, curl)
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'), false);
      }
    },
    credentials: true, 
    // allowedHeaders: ['Content-Type', 'Authorization'],
  })
);


app.options('*', (req, res) => {
  const origin = req.headers.origin;

  // Check if the origin is in the allowed list or if there's no origin (e.g., Postman, curl)
  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);  // Set the correct origin
  } else {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_BASE_URL_LIVE);  // Fallback if not in the list
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Respond with a 204 status for OPTIONS (preflight) requests
  res.status(204).send();
});
 
// Additional middleware
 
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, curl, etc.)
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

app.use(cors(corsOptions));
 



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);


export default app;