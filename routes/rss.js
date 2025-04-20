const RSS = require("rss");
const Parser = require("rss-parser");

const blogRegistry = require("../config");

/** Max items for the combined RSS feed. */
const MAX_FEED_ITEMS = 50;

const parser = new Parser();

async function combinedRSSFeedRoute(req, res) {
  const blogUrls = Object.keys(blogRegistry);
  const siteUrl = `${req.protocol}://${req.get("host")}`;

  const feedUrl = `${siteUrl}/rss.xml`;

  try {
    // 1. Fetch feed items with metadata for each blog.
    const listOfFeedItemResults = await Promise.allSettled(
      blogUrls.map(async (url) => {
        try {
          const feed = await parser.parseURL(blogRegistry[url]["feedLink"]);

          const author = blogRegistry[url]["chosenName"];
          const blogUrl = url;
          const publishedAt = new Date(feed.items[0].pubDate);

          return feed.items.map((item) => ({
            item,
            metadata: { author, blogUrl, publishedAt },
          }));
        } catch (err) {
          console.warn(`Failed to fetch or parse feed for "${url}"`, err);

          // Fallback to an empty array if the feed is not found or cannot be
          // parsed.
          return [];
        }
      })
    );

    const listOfFeedItems = listOfFeedItemResults.map((result) => result.value);

    const feedItems = listOfFeedItems.flat();

    // 2. Sort the feed items by publication date (newest first).
    feedItems.sort((a, b) => b.metadata.publishedAt - a.metadata.publishedAt);

    // 3. Limit the list of feed items.
    const latestFeedItems = feedItems.slice(0, MAX_FEED_ITEMS);

    // 5. Create the RSS feed object, and add all the items to it.
    const combinedFeed = new RSS({
      description:
        "Latest posts from all participants in the Year of the Blog project.",
      feed_url: feedUrl,
      language: "en",
      pubDate: new Date(), // Feed generated time
      site_url: siteUrl,
      title: "Year of the Blog - Combined Feed",
      ttl: 60, // Cache time in minutes
    });
    for (const {
      item,
      metadata: { author, blogUrl, publishedAt },
    } of latestFeedItems) {
      combinedFeed.item({
        author: author || "Unknown Author",
        date: publishedAt,
        description:
          item.contentSnippet || item.content || "No description available.",
        guid: item.id,
        title: item.title || "Untitled Post",
        url: item.id,
      });
    }

    // 6. Generate XML and send response.
    const xml = combinedFeed.xml({ indent: true });

    res.type("application/rss+xml");
    res.send(xml);
  } catch (error) {
    console.error("Error generating combined RSS feed:", error);
    res.status(500).send("Error generating RSS feed");
  }
}

module.exports = { combinedRSSFeedRoute };
