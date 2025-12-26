import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import route from "../routes/routes.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.js";

const ExpressApp = express();

ExpressApp.set("trust proxy", 1);
ExpressApp.set("trust proxy", 1);

ExpressApp.use(express.json());
ExpressApp.use(express.urlencoded({ extended: true }));

ExpressApp.use(
  cors({
    origin: [
      "https://d3bxc62b4f5pj5.cloudfront.net",
      "http://localhost:5174",
      "http://localhost:5173",
      "https://gyapak.in",
      "https://www.gyapak.in",
      "https://gyapak-admin-upload-data.vercel.app",
      "http://localhost:5176",
      "http://localhost:5175",
    ],
    credentials: true,
  })
);

ExpressApp.use(cookieParser());

// Global authentication middleware - protects all routes except auth endpoints
ExpressApp.use((req, res, next) => {
  // Skip authentication for login and registration endpoints
  const publicPaths = ["/api/auth/login", "/api/auth/registration", "/"];

  if (publicPaths.includes(req.path)) {
    return next();
  }

  verifyToken(req, res, next);
  authorizeRoles("admin");
});

route(ExpressApp);

export default ExpressApp;
