import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import routes from '../routes/routes.js';

if (process.env.NODE_ENV !== "production") {
  (await import('dotenv')).config();
}

const app = express();

app.set('trust proxy', 1);

// Allowed frontend origins
const allowedOrigins = [
  process.env.CLIENT_BASE_URL_LOCAL,
  process.env.CLIENT_BASE_URL_LIVE,
  "https://gyapak.vercel.app",
  "https://gyapak-8ul2.vercel.app",
  "https://gyapak-1.onrender.com",
  "https://gyapak-2.onrender.com",
  "http://localhost:5173"
];

// Backend instances for load balancing
const backendInstances = [
  // "https://gyapak.vercel.app",
  // "https://gyapak-qngw.vercel.app",
  // "https://gyapak-tkpi.vercel.app",
  // "https://gyapak-2.onrender.com",
  "http:localhost:3000"
];

// Round-robin index
let currentIndex = 0;

// Load balancing middleware
const loadBalancer = (req, res, next) => {
  const target = backendInstances[currentIndex];
  currentIndex = (currentIndex + 1) % backendInstances.length; // Move to the next backend instance
  req.target = target; // Attach selected instance to the request object
  console.log(`Request routed to: ${target}`); // Debugging log
  next();

};

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS denied for origin: ${origin}`);
      callback(new Error('CORS not allowed'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', (req, res) => {

  console.log("😭", req.headers.origin);
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || "https://gyapak-1.onrender.com");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(204).send();
});



// Additional middleware to set headers for all responses
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || "https://gyapak-1.onrender.com");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your routes
routes(app);

// Apply load balancer middleware
app.use(loadBalancer);

// Proxy middleware to forward requests to the selected backend instance
app.use(
  '/api', // Forward only API routes
  createProxyMiddleware({
    target: backendInstances[0], // Default target (required but overridden by `req.target`)
    changeOrigin: true,
    router: (req) => req.target, // Use the target selected by the load balancer
    onProxyReq: (proxyReq, req) => {
      console.log(`Proxying request to: ${req.target}${req.url}`);
    },
    onError: (err, req, res) => {
      console.error(`Error proxying request to backend: ${err.message}`);
      res.status(500).send('Proxy error');
    },
  })
);

export default app;
