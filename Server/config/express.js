import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import routes from '../routes/routes.js';
import dotenv from 'dotenv';

// Load environment variables
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

// Trust first proxy
app.set('trust proxy', 1);

// Allowed frontend origins
const allowedOrigins = [
  process.env.CLIENT_BASE_URL_LOCAL,
  process.env.CLIENT_BASE_URL_LIVE,
  "https://gyapak.vercel.app",
  "https://gyapak-8ul2.vercel.app",
  "https://gyapak-1.onrender.com",
  "https://gyapak-2.onrender.com"
].filter(Boolean); // Remove any undefined values

// Backend instances for load balancing
const backendInstances = [
  "https://gyapak-2.onrender.com"
];

// Round-robin index
let currentIndex = 0;

// Load balancing middleware
const loadBalancer = (req, res, next) => {
  if (backendInstances.length === 0) {
    return res.status(503).send('No backend instances available');
  }
  
  const target = backendInstances[currentIndex];
  currentIndex = (currentIndex + 1) % backendInstances.length;
  req.target = target;
  console.log(`Request routed to: ${target}`);
  next();
};

// Single CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS denied for origin: ${origin}`);
      callback(new Error('CORS not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  maxAge: 86400 // CORS preflight cache time (24 hours)
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Parse incoming requests before routing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply load balancer middleware
app.use(loadBalancer);

// Proxy middleware configuration
const proxyOptions = {
  target: backendInstances[0],
  changeOrigin: true,
  router: (req) => req.target,
  onProxyReq: (proxyReq, req) => {
    // If the request has a body, you might need to restream it
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
    console.log(`Proxying request to: ${req.target}${req.url}`);
  },
  onError: (err, req, res) => {
    console.error(`Proxy error: ${err.message}`);
    res.status(500).json({
      message: 'Proxy error occurred',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  },
  pathRewrite: {
    '^/api': '', // Remove /api prefix when forwarding
  }
};

// Apply proxy middleware
app.use('/api', createProxyMiddleware(proxyOptions));

// Apply routes
routes(app);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

export default app;