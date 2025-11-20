import crypto from "crypto";
import Notification from "../models/notification.model.js";

export const makeItemHash = (sourceCode, item) => {
  const payload = `${sourceCode}|${item.title}|${item.link}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
};

export const saveNewNotifications = async (source, items) => {
  if (!items || !items.length) return [];

  const bulkOps = items.map((it) => {
    const itemHash = makeItemHash(source.code, it);

    return {
      updateOne: {
        filter: { sourceCode: source.code, link: it.link },
        update: {
          $setOnInsert: {
            sourceId: source._id,
            sourceCode: source.code,
            title: it.title,
            link: it.link,
            summary: it.summary || null,
            rawText: it.rawText || null,
            publishedAt: it.publishedAt || new Date(),
            firstSeenAt: new Date(),
            itemHash,
          },
        },
        upsert: true,
      },
    };
  });

  const result = await Notification.bulkWrite(bulkOps, { ordered: false });

  const insertedIds = result.upsertedIds
    ? Object.values(result.upsertedIds)
    : [];

  if (!insertedIds.length) return [];

  const newDocs = await Notification.find({ _id: { $in: insertedIds } }).lean();
  return newDocs;
};
