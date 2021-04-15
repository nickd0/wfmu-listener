import { app } from 'electron'
import path from 'path'
import fs from 'fs'

const userDataPath = app.getPath('userData')
const userDataFile = path.join(userDataPath, 'userData.json')

type UserDataType = {[key: string]: any}

interface PlaylistHistory {
  id: number,
  name: string,
  listenedAt: string
}

interface UserData {
  lastOpen?: string,
  numOpens?: number,
  playlistHistory?: PlaylistHistory[]
}

// TODO: more strongly type this
export const writeUserData = (data: UserDataType): boolean => {
  dataCache = Object.assign({}, dataCache, data)
  try {
    fs.writeFile(userDataFile, JSON.stringify(dataCache), function(err) {
      if (err) {
        console.error('Failed to write user file')
      }
    })
    return true
  } catch {
    return false
  }
}

// TODO: more strongly type this
export const incrementUserKey = (key: string, incVal: number): boolean => {
  return writeUserData({ [key]: (dataCache[key] || 0) + incVal })
}

export const recordPlaylistHistory = (playlist: PlaylistHistory): boolean => {
  let playlists = dataCache.playlistHistory || {}
  playlists[playlist.id] = playlist
  return writeUserData({ playlistHistory: playlists })
}

// TODO: more strongly type this
export const appendUserKey = (key: string, item: any): boolean => {
  return writeUserData({ [key]: (dataCache[key] || []).push(item) })
}

// TODO: more strongly type this
export const readUserData = (key: string | null = null): any => {
  try {
    if (!dataCache) {
      let fileStr = fs.readFileSync(userDataFile, 'utf-8')
      dataCache = JSON.parse(fileStr)
    }
    if (key) {
      return dataCache[key]
    } else {
      return dataCache
    }
  } catch {
    console.error('Failed to read')
    return undefined
  }
}

let dataCache: any = readUserData() || {}
