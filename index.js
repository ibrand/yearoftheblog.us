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

// Handling the get request
app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": "*",
    });

    const blogRssUrls = Object.keys(blogRegistry)
    const promises = blogRssUrls.map((url) =>parser.parseURL(url))

    Promise.all(promises).then(feeds => {
        res.render("index", {'feeds': feeds, 'blogRegistry': blogRegistry});
    });
});

// Starting the server on the 80 port
app.listen(port, () => {
    console.log(`The application started
                 successfully on port ${port}`);
});