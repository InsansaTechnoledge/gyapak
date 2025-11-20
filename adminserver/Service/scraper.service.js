// services/scraper.service.js
import axios from "axios";
import * as cheerio from "cheerio";
import Parser from "rss-parser";
import https from "https";

const rssParser = new Parser();

export const fetchItemsForSource = async (source) => {
  const timeout = source.requestTimeoutMs || 60000;

  const httpsAgent =
    source.skipTlsVerify === true
      ? new https.Agent({ rejectUnauthorized: false })
      : undefined;

  // 🔹 1) RSS SOURCES
  if (source.type === "rss") {
    try {
      console.log("RSS fetch for", source.code, source.notificationUrl);

      const res = await axios.get(source.notificationUrl, {
        timeout,
        httpsAgent,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/120.0 Safari/537.36 GyapakBot/1.0",
          Accept:
            "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.7",
        },
        maxRedirects: 5,
      });

      const xml = res.data;

      const feed = await rssParser.parseString(xml);

      console.log(
        `RSS items fetched for ${source.code}:`,
        feed.items ? feed.items.length : 0
      );

      return (feed.items || []).map((it) => {
        const rawPub = it.isoDate || it.pubDate || null;
        let publishedAt = null;

        if (rawPub) {
          const parsed = new Date(rawPub);
          if (!isNaN(parsed.getTime())) {
            publishedAt = parsed;
          }
        }

        let link = it.link;

        // Clean up odd double-prefixed links (SEBI case)
        if (link && link.startsWith("https://www.sebi.gov.in/https://")) {
          link = link.replace("https://www.sebi.gov.in/", "");
        }

        return {
          title: (it.title || "").trim(),
          link,
          summary: it.contentSnippet || it.description || null,
          publishedAt: publishedAt || new Date(),
        };
      });
    } catch (err) {
      console.error(`RSS fetch error for ${source.code}:`, err.message);
      return [];
    }
  }

  // 🔹 2) HTML SOURCES
  try {
    console.log("HTML fetch for", source.code, source.notificationUrl);

    const res = await axios.get(source.notificationUrl, {
      timeout,
      httpsAgent,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0 Safari/537.36 GyapakBot/1.0",
      },
      maxRedirects: 5,
    });

    const $ = cheerio.load(res.data);
    const root = source.selector ? $(source.selector) : $("body");
    const items = [];

    root.find("a").each((i, el) => {
      const title = $(el).text().trim();
      const href = $(el).attr("href");
      if (!title || !href) return;

      const link = new URL(href, source.baseUrl || source.notificationUrl).href;

      items.push({
        title,
        link,
        summary: null,
        publishedAt: new Date(),
      });
    });

    console.log(`HTML items fetched for ${source.code}:`, items.length);
    return items;
  } catch (err) {
    console.error(`HTML fetch error for ${source.code}:`, err.message);
    return [];
  }
};
