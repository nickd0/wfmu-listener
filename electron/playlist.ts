import SongInterface from '../interfaces/song'

import fetch, { Response } from 'node-fetch'
import * as cheerio from 'cheerio'
import PlaylistInterface, { PlaylistStyle } from '../interfaces/playlist'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const css = require('css')

// Streaming files:
//https://s3.amazonaws.com/arch.wfmu.org/WA/wa210216.mp4#t=458
// http://mp3archives.wfmu.org/archive/kdb/mp3jump2010.mp3/0:8:4/0/VC/vc210218.mp3
// Can add timestamp with #t={ts in seconds}
export class Song implements SongInterface {
  title: string;
  artist: string;
  album: string | null;
  label: string | null;
  timestampStr: string | null;
  timestamp: number | null;
  loaded: boolean;

  constructor(title: string, artist: string, timestamp: string | null) {
    this.title = title
    this.artist = artist
    this.timestampStr = timestamp
    this.album = null
    this.label = null
    this.loaded = false

    this.timestamp = this.timestampStr?.split(':')
      .map((v) => parseInt(v))
      .reduce((acc: number, val: number, i: number) => {
        if (i === 0) {
          acc += val * 3600
        } else if (i === 1) {
          acc += val * 60
        } else {
          acc += val
        }
        return acc
      }, 0) ?? null
  }
}

const PLAYLIST_BASE_URL = "https://www.wfmu.org/playlists/shows/";

export interface PlaylistRawObject {
  title: Array<string>,
  link: Array<string>
}

export function fetchPlaylistFile(playlist: Playlist): Promise<Playlist> {
  return fetch(playlist.streamUrl)
    .then((resp: Response) => resp.text())
    .then((mp3Url: string) => {
      return new Promise((resolve) => {
        playlist.mp3Url = mp3Url
        resolve(playlist)
      })
    })
}

export function fetchPlaylistInfo(playlist: Playlist): Promise<Playlist> {
  const url = new URL(playlist.id.toString(), PLAYLIST_BASE_URL)
  return fetch(url)
    .then((resp: Response) => resp.text())
    .then((text: string) => {
      return new Promise((resolve) => {
        const $ = cheerio.load(text)

        // Scrape playlist page
        $('tr[id^="drop_"]').each((i, el) => {
          const dat = $(el)
          const artist = dat.find('.col_artist').text().trim()
          const title = dat.find('.col_song_title').text().trim()
          const tsRaw = dat.find('.col_live_timestamps_flag').text().trim()
          const ts = tsRaw.match(/(\d:\d{2}:\d{2})/)?.[0] ?? null

          playlist.songs.push(new Song(title, artist, ts))
        })
        const styleSheet = $('#playlist_css_additional')
        const parsed = css.parse(styleSheet.contents().text())
        const rules = parsed.stylesheet.rules.filter((r) => r.selectors.includes('BODY') || r.selectors.includes('body'))
        playlist.style = {}
        rules.forEach((r) => {
          r.declarations.forEach((d) => {
            playlist.style[d.property] = d.value
          })
        })
        playlist.loaded = true

        resolve(playlist)
      })
    })
}

export default class Playlist implements PlaylistInterface {
  id: number;
  showName: string;
  dateStr: string;
  playlistUrl: string;
  streamUrl: string;
  mp3Url: string | null;
  songs: Song[];
  style: unknown;
  loaded: boolean;

  constructor(obj: PlaylistRawObject) {
    const title = obj.title[0]
    const matches = title.match(/: (.*) from (.*)$/)

    this.showName = matches?.[1] ?? '--'
    this.dateStr = matches?.[2] ?? '--'

    // TODO
    this.streamUrl = obj.link[0]
    this.id = parseInt(obj.link[0].match(/show=(\d+)$/)?.[1] ?? '0')
    this.playlistUrl = PLAYLIST_BASE_URL + this.id.toString()

    this.songs = []
    this.mp3Url = null
    this.loaded = false
  }

  fetchInfo(): Promise<Playlist> {
    const url = new URL(this.id.toString(), PLAYLIST_BASE_URL)
    return fetch(url)
      .then((resp: Response) => resp.text())
      .then((text: string) => {
        return new Promise((resolve) => {
          const $ = cheerio.load(text)
          $('tr[id^="drop_"]').each((i, el) => {
            const dat = $(el)
            const artist = dat.find('.col_artist').text().trim()
            const title = dat.find('.col_song_title').text().trim()
            const tsRaw = dat.find('.col_live_timestamps_flag').text().trim()
            const ts = tsRaw.match(/(\d:\d{2}:\d{2})/)?.[0] ?? ''

            this.songs.push(new Song(title, artist, ts))
            resolve(this)
          })
        })
      })
  }
}
