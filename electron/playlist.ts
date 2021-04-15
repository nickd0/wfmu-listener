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
  approxTimestamp: boolean;

  constructor(title: string, artist: string, timestamp: string | null) {
    this.title = title === '' ? 'Your DJ speaks' : title
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

    this.approxTimestamp = this.timestamp === null
  }

  addTime(n: number): number | null {
    if (this.timestamp !== null) {
      return this.timestamp! + n
    }
    return null
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

        if (playlist.showName === '--') {
          let titleText = $('h2').first().text().trim().replace(/\n+/g, ' ')
          let [showName, dateStr] = scrapeTitle(titleText)
          playlist.showName = showName
          playlist.dateStr = dateStr
        }

        // Scrape playlist page
        $('tr[id^="drop_"]').each((i, el) => {
          const dat = $(el)
          const artist = dat.find('.col_artist').text().trim()
          const title = dat.find('.col_song_title').text().trim()
          const tsRaw = dat.find('.col_live_timestamps_flag').text().trim()
          const ts = tsRaw.match(/(\d:\d{2}:\d{2})/)?.[0] ?? null

          playlist.songs.push(new Song(title, artist, ts))
        })

        // TODO, this can be done in 1 loop, fix
        playlist.songs.forEach((song, i) => {
          if (i > 0 && song.timestamp === null) {
            playlist.songs[i].timestamp = playlist.songs[i - 1]?.addTime(240) ?? null
          }
        })

        if (playlist.streamUrl.indexOf('wfmu-listener://') !== -1) {
          const listenPath = $('#date_desc_archive_section a').get(1).attribs.href
          playlist.streamUrl = `https://www.wfmu.org${listenPath}`
        }

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

const scrapeTitle = (title: string): [string, string] => {
  const matches = title.match(/(.*): (.*) from (.*)$/)

  if (matches?.[2] === 'Playlist') {
    return [matches?.[1] ?? '--', matches?.[3] ?? '--']
  }

  return [matches?.[2] ?? '--', matches?.[3] ?? '--']
}

export default class Playlist implements PlaylistInterface {
  id: number;
  showName: string;
  dateStr: string;
  playlistUrl: string;
  streamUrl: string;
  mp3Url: string | null;
  songs: Song[];
  style?: { [key: string]: string };
  loaded: boolean;

  constructor(obj: PlaylistRawObject | null) {
    const title = obj!.title[0]

    const [showName, dateStr] = scrapeTitle(title ?? '')
    this.showName = showName
    this.dateStr = dateStr

    // TODO
    this.streamUrl = obj!.link[0]
    this.id = parseInt(obj!.link[0].match(/show=(\d+)$/)?.[1] ?? '0')
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
