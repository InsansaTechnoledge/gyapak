import cron from "node-cron";
import { runScraper } from "../services/scraperService.js";

// Runs every 2 hours
cron.schedule("0 */2 * * *", () => {
  console.log("Running task every 2 hours:", new Date().toISOString());
});

// Runs every 2 months on the 1st day of the month at midnight
cron.schedule("0 0 1 */2 *", () => {
  console.log("Running task every 2 months:", new Date().toISOString());
});

cron.schedule("* * * * *", async () => {
    console.log("Running task every 1 minute:", new Date().toISOString());
    console.log("🚀 Running script via Railway Scheduler...");
    try {
        await runScraper();
        console.log("✅ Task Completed!");
      } catch (error) {
        console.error("❌ Error running scraper:", error);
      }
  })

console.log("Scheduler started...");
