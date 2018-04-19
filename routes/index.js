var express = require('express');
var router = express.Router();
var FeedParser = require('feedparser');
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = [];
  var feed = request('https://liginc.co.jp/feed/');
  var feedparser = new FeedParser();

  feed.on('error', function(error) {
    // request エラー処理
  });

  feed.on('response', function(feed_res) {
    var stream = this;
    if (feed_res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'));
    } else {
      stream.pipe(feedparser);
    }
  });

  feedparser.on('error', function(error) {
    // feedparser エラー処理
  });

  feedparser.on('readable', function() {
    var item;
    while (item = this.read()) {
      data.push({
        'title': item.title,
        'url': item.link
      });
    }
  });

  feedparser.on('end', function() {
    res.render('index', {title: 'LIG Feed', data: data});
  });
});

module.exports = router;
