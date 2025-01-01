# yearoftheblog.us
Year of The Blog Directory Site

## Contributing
To add yourself or (someone) to the directory, add your atom or rss feed link as the key and the name you'd like to be seen as to the value to the config object.

To run locally:
1. `git clone` the repo onto your machine
2. Run `npm install` to download all necessary packages
3. Run `npm run dev` to start the server and then visit `127.0.0.1:80`

## TODO
- Try moving the RSS links to RSS instead of atom
- Fix the spinner animation so that the speed matches up to 5 or so blogs and then randomly choose which blogs get to go in on refresh (probably template side)
- Maybe make a roundup newsletter weekly that people can subscribe to that sends all of the blogs that updated that week
- Figure out if I can get content snippets from non-bearblog blogs
- Properly trim the trailing slash so that it doesn't matter whether a blog has a `/` at the end of their `feedUrl` or not
