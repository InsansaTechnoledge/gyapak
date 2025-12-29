import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import route from "../routes/routes.js";

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

route(ExpressApp);

export default ExpressApp;
