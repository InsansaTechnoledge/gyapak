import dotenv from "dotenv";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cron from "node-cron";
import express from "express";
import path from "path";
import { File, Blob } from "node:buffer";
import { fileURLToPath } from "node:url";
dotenv.config();
import { monitorAllSources } from "./Jobs/monitorSources.job.js";
import publishScheduledPdfs from "./Jobs/scheduled-magazine.job.js";
import reportGenerationJob from "./Jobs/report-generation.js";

globalThis.File = File;
globalThis.Blob = Blob;

// ESM __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dynamic import (factory)
const appFactory = (await import("./app.js")).default;

const initialize = async () => {
  try {
    const app = await appFactory();

    // ✅ Static files
    app.use(express.static(path.join(__dirname, "public")));

    // Health check
    app.get("/", (req, res) => {
      res.status(200).json({ message: "server is running" });
    });

    // HTTP server
    const server = http.createServer(app);

    // Socket.IO
    const io = new SocketIOServer(server, {
      cors: {
        origin: [
          "https://d3bxc62b4f5pj5.cloudfront.net",
          "http://localhost:5173",
          "http://localhost:5174",
          "http://localhost:5175",
          "http://localhost:5176",
          "https://gyapak.in",
          "https://www.gyapak.in",
          "https://gyapak-admin-upload-data.vercel.app",
        ],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("subscribe-source", (sourceCode) => {
        socket.join(sourceCode);
        console.log(`Socket ${socket.id} joined ${sourceCode}`);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    global.io = io;

    // Cron jobs
    cron.schedule("*/2 * * * *", async () => {
      await monitorAllSources(io);
    });

    cron.schedule("*/30 * * * *", async () => {
      await publishScheduledPdfs();
    });

    cron.schedule("0 0 * * *", async () => {
      await reportGenerationJob();
    });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Initialization error:", err);
  }
};

initialize();
