import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import routes from '../routes/routes.js';
import passportsessionMiddleware from '../Utility/passportSession.js';
import passport from '../Utility/Passport.js';
import cookieParser from 'cookie-parser';
import { CLIENT_BASE_URL_LOCAL,CLIENT_BASE_URL_LIVE } from './env.js';
import bodyParser from 'body-parser';
import { generateSitemap } from '../controller/mongoController/sitemap.controller.js';


const app = express();

// app.set('trust proxy', 1);

// in your main app.js or server.js
app.set('trust proxy', true);


// Allowed frontend origins (ensure these are correctly set in .env)
const allowedOrigins = [
  // CLIENT_BASE_URL_LOCAL,
  CLIENT_BASE_URL_LIVE,
  "https://insansa.com",
  "http://localhost:5173",
  // "http://localhost:5174",
  "https://gyapak.in",
  "https://www.gyapak.in",
  // "https://gyapak-test-series.vercel.app",
].filter(Boolean); // Remove undefined values

// Backend instances for load balancing
const backendInstances = [
  // "https://backend.gyapak.in", 
  // "http://localhost:5000",
  "http://localhost:8383",
  // 'https://gyapak-test-server.onrender.com'
];

let currentIndex = 0;

// Load balancing middleware
const loadBalancer = (req, res, next) => {
  req.target = backendInstances[currentIndex];
  currentIndex = (currentIndex + 1) % backendInstances.length;
  console.log(`Request routed to: ${req.target}`);
  next();
};

app.get('/sitemap.xml', generateSitemap);


app.use((req, res, next) => {
  if (!req.headers.origin) {
    return res.status(403).json({ error: "Direct browser requests are not allowed" });
  }
  next();
});


// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // return callback(null, true);
    if (!origin) {
      console.error('CORS denied: No origin');
      return callback(null, false);
    }
    else if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.error(`CORS denied for origin: ${origin}`);
      return callback(null, false);
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
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send('✅ Server is running perfectly !!');
});

app.use(cookieParser());

app.use(passportsessionMiddleware);

app.use(passport.initialize());
app.use(passport.session()); // If using sessions


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

