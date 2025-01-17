// Importing modules
const express = require("express");
const rssParser = require('rss-parser');
const blogRegistry = require('./config')

const port = 80;
const app = express();
const parser = new rssParser();

// For serving static html files
app.use(express.static(__dirname + '/'));
app.use(express.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const blogUrls = Object.keys(blogRegistry)
const NUMBER_OF_FEATURED_FEEDS = 5

const sortByLatestDate = (feedA, feedB) => {
    if (!feedA["items"] || !feedA["items"].length) {
      return 1;
    }

    if (!feedB["items"] || !feedB["items"].length) {
      return -1;
    }

    return (
      new Date(feedB.items[0]["pubDate"]) - new Date(feedA.items[0]["pubDate"])
    );
  };

// Handling the get request
app.get("/", (req, res) => {
    // Choose 5 feeds to feature in the spinner at the bottom of the page per reload
    // TODO: make this random, so it's not always the first 5 in the list
    // We're not actually using this in the template yet because it's not random
    let featuredFeeds = []

    const promises = blogUrls.map(async (url) => {
        feed = await parser.parseURL(blogRegistry[url]["feedLink"]);
        return {
          blogUrl: url,
          chosenName: blogRegistry[url]["chosenName"],
          ...feed,
        };
    });

    Promise.allSettled(promises).then( (feeds, index) => {
        // filter out the failed promises and get the feed object out of the promise wrapper
        let viableFeeds = feeds.filter((feedPromise) => feedPromise.status == 'fulfilled').map((feedPromise) => feedPromise.value).sort(sortByLatestDate)

        viableFeeds.forEach( (feed, index) => {
            if (feed['items'] && feed['items'].length) {
                let contentSnippet = feed['items'][0]['contentSnippet']
                if (contentSnippet == undefined) { return }
                feed['currentSnippet'] = contentSnippet?.slice(0,30) + '...'

                if (featuredFeeds.length <= NUMBER_OF_FEATURED_FEEDS) {
                    featuredFeeds.push(feed)
                }
            }
        })

        res.render("index", {'feeds': viableFeeds, 'featuredFeeds': featuredFeeds});
    });
});

// Starting the server on the 80 port
app.listen(port, () => {
    console.log(`The application started
                 successfully on port ${port}`);
});