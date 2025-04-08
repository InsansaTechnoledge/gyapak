import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import routes from '../routes/routes.js';

if (process.env.NODE_ENV !== "production") {
  (await import('dotenv')).config();
}

const app = express();

app.set('trust proxy', 1);

// Allowed frontend origins (ensure these are correctly set in .env)
const allowedOrigins = [
  process.env.CLIENT_BASE_URL_LOCAL,
  process.env.CLIENT_BASE_URL_LIVE,
  "https://insansa.com",
  // "http://localhost:5173",
  "https://gyapak.in",
  "https://www.gyapak.in"
].filter(Boolean); // Remove undefined values

// Backend instances for load balancing
const backendInstances = [
  "https://backend.gyapak.in"
  // "http://localhost:5000"
];

let currentIndex = 0;

// Load balancing middleware
const loadBalancer = (req, res, next) => {
  req.target = backendInstances[currentIndex];
  currentIndex = (currentIndex + 1) % backendInstances.length;
  console.log(`Request routed to: ${req.target}`);
  next();
};

app.use((req, res, next) => {
  if (!req.headers.origin) {
    return res.status(403).json({ error: "Direct browser requests are not allowed" });
  }
  next();
});


// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {

    if (!origin) {
      console.error('CORS denied: No origin');
      return callback(null, false);
    }
    else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS denied for origin: ${origin}`);
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
};


// Apply CORS middleware globally (before routes)
app.use(cors(corsOptions));

// Handle preflight requests properly
app.options('*', cors(corsOptions));

// Parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send('✅ Server is running perfectly !!');
});


// Your routes
routes(app);

// Apply load balancer middleware
app.use(loadBalancer);

// Proxy middleware
app.use(
  '/api',
  createProxyMiddleware({
    target: backendInstances[0], // Default target
    changeOrigin: true,
    router: (req) => req.target,
    onProxyReq: (proxyReq, req) => {
      console.log(`Proxying request to: ${req.target}${req.url}`);
    },
    onError: (err, req, res) => {
      console.error(`Error proxying request: ${err.message}`);
      res.status(500).send('Proxy error');
    },
  })
);

export default app;

