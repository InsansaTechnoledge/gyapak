import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Fix "__dirname" in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export  const runScraper = async () => {
    return new Promise((resolve, reject) => {
        console.log("⏳ Running Python scraper...");

        const pythonProcess = spawn("python", [path.join(__dirname, "../../scripts/hello.py")]);


        pythonProcess.stdout.on("data", (data) => {
            console.log(`📌 Python Output: ${data.toString()}`);
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error(`⚠️ Python Error: ${data.toString()}`);
        });

        pythonProcess.on("close", (code) => {
            console.log(`✅ Python script finished with exit code ${code}`);
            resolve();
        });

        pythonProcess.on("error", (err) => {
            console.error("❌ Failed to start Python script:", err);
            reject(err);
        });
    });
};
