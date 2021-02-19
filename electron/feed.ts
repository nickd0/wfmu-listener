import fetch, { Response } from 'node-fetch';
import { parseStringPromise } from 'xml2js';
import { ipcMain } from 'electron';

import Playlist from "./playlist";

// https://wfmu.org/playlistfeed.xml
// Sample playlist URL https://www.wfmu.org/playlists/shows/101344

const DEFAULT_FEED = "https://wfmu.org/playlistfeed.xml";

type PlaylistFeedRawObject = {
  title: Array<string>,
  link: Array<string>
}

 export class PlaylistFeedItem {
  showName: string | null;
  djName: string | null;
  dateStr: string | null;
  playlistId: number | null;
  playlistLink: URL | null;

  constructor(obj: PlaylistFeedRawObject) {
    let title = obj.title[0];
    let matches = title.match(/^WFMU Playlist: (.*) with (.*) from (.*)$/);
    
    if (matches) {
      this.showName = matches?.[1] ?? "--";
      this.djName = matches?.[2] ?? "--";
      this.dateStr = matches?.[3] ?? "--";

    } else {
      let matches = title.match(/^WFMU Playlist: (.*) from (.*)$/);
      this.showName = matches?.[1] ?? "--";
      this.djName = null;
      this.dateStr = matches?.[2] ?? "--";
    }

    // TODO
    this.playlistLink = new URL(obj.link[0]);
    this.playlistId = parseInt(obj.link[0].match(/\d+$/)?.[0] ?? '0');
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
    return fetch(this.feedURL)
      .then(res => res.text())
      .then(parseStringPromise)
      .then(parsed => {
        return new Promise((resolve, reject) => {
          let feed = parsed.rss;
          this.pubDate = new Date(feed.pubDate);
          // TODO don't assume single channel?
          feed.channel[0].item
            .filter((item: PlaylistFeedRawObject) => (
              item.title.length > 0
            ))
            .map((item: PlaylistFeedRawObject) => {
              this.items.push(new PlaylistFeedItem(item))
            });
          resolve(this.items);
        });

        // Fetch the playlist when selected
        // let pl = new Playlist(this.items[0].playlistId, "desc");
        // pl.fetchInfo();
      })
  }
}
