import fetch, { Response } from 'node-fetch';
import { parseStringPromise } from 'xml2js';
import { ipcMain } from 'electron';

import Playlist, { PlaylistRawObject } from "./playlist";

// https://wfmu.org/playlistfeed.xml
// Sample playlist URL https://www.wfmu.org/playlists/shows/101344

// const DEFAULT_FEED = "https://wfmu.org/playlistfeed.xml";
const DEFAULT_FEED = "http://www.wfmu.org/archivefeed/mp3.xml";
// use this http://www.wfmu.org/archivefeed/mp3.xml

export default class PlaylistFeed {
  feedURL: string;
  parsed: boolean;
  items: Playlist[];
  pubDate: Date | null;

  constructor(feedURL: string = DEFAULT_FEED) {
    this.feedURL = feedURL
    this.parsed = false
    this.items = []
    this.pubDate = null
  }

  fetchFeed() {
    return fetch(this.feedURL)
      .then((res: Response) => res.text())
      .then(parseStringPromise)
      .then((parsed: any) => {
        return new Promise((resolve, reject) => {
          const feed = parsed.rss
          this.pubDate = new Date(feed.pubDate);
          // TODO don't assume single channel?
          feed.channel[0].item
            .map((item: PlaylistRawObject) => {
              this.items.push(new Playlist(item))
            });
          resolve(this.items)
        });

        // Fetch the playlist when selected
        // let pl = new Playlist(this.items[0].playlistId, "desc");
        // pl.fetchInfo();
      })
  }
}
