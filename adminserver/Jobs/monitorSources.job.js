import { Source } from "../models/source.model.js";
import { saveNewNotifications } from "../Service/notification.service.js";
import { fetchItemsForSource } from "../Service/scraper.service.js";

// e.g. src/utils/dateWindow.js
const getFreshCutoff = (days = 4) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // start of today if you want strict “today”
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return cutoff;
  };
  

// const checkOneSource = async (source, io) => {
//   try {
//     const items = await fetchItemsForSource(source);
//     if (!items.length) {
//       console.log(`No items fetched for ${source.code}`);
//       return;
//     }

//     const newDocs = await saveNewNotifications(source, items);

//     if (newDocs.length) {
//       console.log(`New notifications for ${source.code}: ${newDocs.length}`);

//       if (io) {
//         // Room per source
//         io.to(source.code).emit("new-notifications", newDocs);
//         // Optional global event
//         io.emit("new-notifications-global", newDocs);
//       }
//     }

//     source.lastCheckedAt = new Date();
//     await source.save();
//   } catch (err) {
//     console.error(`Error checking ${source.code}:`, err.message);
//   }
// };

const checkOneSource = async (source, io) => {
    try {
      const items = await fetchItemsForSource(source);
      if (!items.length) return;
  
      const newDocs = await saveNewNotifications(source, items);
  
      if (newDocs.length) {
        const cutoff = getFreshCutoff(4); // last 4 days
  
        const freshDocs = newDocs.filter((doc) => {
          const d = doc.publishedAt || doc.firstSeenAt;
          return d && new Date(d) >= cutoff;
        });
  
        if (freshDocs.length) {
          console.log(
            `Fresh notifications for ${source.code} in last 4 days:`,
            freshDocs.length
          );
  
          io?.to(source.code).emit("new-notifications", freshDocs);
          io?.emit("new-notifications-global", freshDocs);
        }
      }
  
      source.lastCheckedAt = new Date();
      await source.save();
    } catch (err) {
      console.error(`Error checking ${source.code}:`, err.message);
    }
  };
  
export const monitorAllSources = async (io) => {
  console.log("Running monitorAllSources...");

  const sources = await Source.find({ isActive: true });

  for (const source of sources) {
    // Respect interval
    if (
      Source.lastCheckedAt &&
      source.intervalMinutes &&
      Date.now() - source.lastCheckedAt.getTime() <
        source.intervalMinutes * 60 * 1000
    ) {
      continue;
    }

    await checkOneSource(source, io);
  }

  console.log("monitorAllSources done.");
};
