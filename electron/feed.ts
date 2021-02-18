import fetch, { Response } from 'node-fetch';
import { parseStringPromise } from 'xml2js';

// https://wfmu.org/playlistfeed.xml

const DEFAULT_FEED = "https://wfmu.org/playlistfeed.xml";

type PlaylistFeedRawObject = {
  title: string,
  link: string
}

class PlaylistFeedItem {
  title: string;
  playlistId: number;
  playlistLink: URL;

  constructor(obj: PlaylistFeedRawObject) {
    this.title = obj.title;

    // TODO
    this.playlistId = 1;
    this.playlistLink = new URL(obj.link);
  }
}

export default class PlaylistFeed {
  feedURL: string;
  parsed: boolean;
  items: Array<PlaylistFeedItem>;
  pubDate: Date | null;

  constructor(feedURL: string = DEFAULT_FEED) {
    this.feedURL = feedURL;
    this.parsed = false;
    this.items = [];
    this.pubDate = null;
  }

  fetchFeed() {
    fetch(this.feedURL)
      .then(res => res.text())
      .then(parseStringPromise)
      .then(parsed => {
        let feed = parsed.rss;
        this.pubDate = new Date(feed.pubDate);
        // TODO don't assume single channel
        feed.channel[0].item.map((item: PlaylistFeedRawObject) => {
          this.items.push(new PlaylistFeedItem(item))
        })
        console.log("Feed fetched at " + this.pubDate!);
      })
  }
}
