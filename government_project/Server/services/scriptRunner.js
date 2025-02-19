import runScraper from "./scraperService.js";

(async () => {
    console.log("🚀 Running script via Railway Scheduler...");
    await runScraper();
    console.log("✅ Task Completed!");
})();

