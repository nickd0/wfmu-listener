import SongInterface from '../interfaces/song'

import fetch, { Response } from 'node-fetch'
import * as cheerio from 'cheerio'

export class Song implements SongInterface {
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

export interface PlaylistRawObject {
  title: Array<string>,
  link: Array<string>
}

export default class Playlist {
  id: number;
  showName: string;
  dateStr: string;
  playlistUrl: URL;
  streamUrl: URL;
  songs: Song[];

  constructor(obj: PlaylistRawObject) {
    let title = obj.title[0];
    let matches = title.match(/\: (.*) from (.*)$/);
    
    this.showName = matches?.[1] ?? "--";
    this.dateStr = matches?.[2] ?? "--";

    // TODO
    this.streamUrl = new URL(obj.link[0]);
    this.id = parseInt(obj.link[0].match(/show=(\d+)$/)?.[1] ?? '0');
    this.playlistUrl = new URL(this.id.toString(), PLAYLIST_BASE_URL);

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
