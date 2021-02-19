import fetch, { Response } from 'node-fetch';
import * as cheerio from 'cheerio';

class Song {
  title: string;
  artist: string;
  album: string | null;
  label: string | null;
  timestamp: string;

  constructor(title: string, artist: string, timestamp: string) {
    this.title = title;
    this.artist = artist;
    this.timestamp = timestamp;
    this.album = null;
    this.label = null;
  }

}

const PLAYLIST_BASE_URL = "https://www.wfmu.org/playlists/shows/";

export default class Playlist {
  songs: Array<Song>;
  id: number;
  desc: string;

  constructor(id: number, desc: string) {
    this.id = id;
    this.desc = desc;
    this.songs = [];
  }

  fetchInfo() {
    let url = new URL(this.id.toString(), PLAYLIST_BASE_URL);
    return fetch(url)
      .then((resp: Response) => resp.text())
      .then((text: string) => {
        return new Promise((resolve, reject) => {
          let $ = cheerio.load(text);
          $('tr[id^="drop_"]').each((i, el) => {
            let dat = $(el);
            let artist = dat.find('.col_artist').text().trim();
            let title = dat.find('.col_song_title').text().trim();
            let ts_raw = dat.find('.col_live_timestamps_flag').text().trim();
            let ts = ts_raw.match(/(\d:\d{2}:\d{2})/)?.[0] ?? "";

            this.songs.push(new Song(title, artist, ts));
            resolve(this.songs);
          });
        });

      })
  }
}
