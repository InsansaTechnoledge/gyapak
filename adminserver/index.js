import dotenv from "dotenv";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cron from "node-cron";
import { monitorAllSources } from "./Jobs/monitorSources.job.js";
import publishScheduledPdfs from "./Jobs/scheduled-magazine.job.js";

import { File, Blob } from "node:buffer";

globalThis.File = File;
globalThis.Blob = Blob;

// import { monitorAllSources } from './jobs/monitorSources.job.js';

dotenv.config();

// dynamic import of app (keeps your current pattern)
const app = (await import("./app.js")).default;

const initialize = async () => {
  try {
    const appInstance = await app();

    // Health check route (keep this)
    appInstance.get("/", (req, res) => {
      console.log("server is live ");
      res.status(200).json({
        message: "server is running",
      });
    });

    // 🔹 1) Create HTTP server from your Express app
    const server = http.createServer(appInstance);

    // 🔹 2) Attach Socket.IO to that HTTP server
    const io = new SocketIOServer(server, {
      cors: {
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
      },
    });

    // 🔹 3) Handle Socket.IO connections
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      // Frontend will send: socket.emit("subscribe-source", "CENTRAL_UPSC")
      socket.on("subscribe-source", (sourceCode) => {
        socket.join(sourceCode);
        console.log(`Socket ${socket.id} joined room ${sourceCode}`);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    // Optionally make io globally visible if you ever need it elsewhere
    global.io = io;

    // 🔹 4) Cron job: monitor ALL sources every 2 minutes
    cron.schedule("*/2 * * * *", async () => {
      console.log("Cron: running monitorAllSources...");
      await monitorAllSources(io);
    });

    // 🔹 5) Cron job: publish scheduled PDFs every 30 minutes
    cron.schedule("*/1 * * * *", async () => {
      console.log("Cron: running publishScheduledPdfs...");
      const result = await publishScheduledPdfs();
      console.log("Cron job result:", JSON.stringify(result, null, 2));
    });

    // 🔹 6) Start HTTP server (NOT appInstance.listen anymore)
    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err, "There was an error initializing the server");
  }
};

initialize();
