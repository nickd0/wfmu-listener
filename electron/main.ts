import { app, BrowserWindow, ipcMain, globalShortcut, systemPreferences } from 'electron'
import * as path from 'path'
import * as url from 'url'
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'
import TrayGenerator from './tray'


import PlaylistFeed from './feed'
import Playlist, { fetchPlaylistInfo, fetchPlaylistFile } from './playlist'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

//TODO
// require('crash-reporter').start();

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info'
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
  }
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../assets')

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths)
}

let mainWindow: Electron.BrowserWindow | null

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 600,
    show: false,
    alwaysOnTop: true,
    resizable: false,
    icon: getAssetPath('icon.icns'),
    // frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000')
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true
      })
    )
  }

  mainWindow.on('show', () => {
  });

  mainWindow.on('blur', () => {
    // mainWindow?.hide()
  })

  ipcMain.on('playlists:ready', () => {
    const fr = new PlaylistFeed()
    fr.fetchFeed()
      .then((playlists: Playlist[]) => {
        mainWindow?.webContents.send('playlists:loaded', { playlists })
      })
  })

  ipcMain.on('playlist:show', (evt, args: {playlist: Playlist}) => {
    fetchPlaylistInfo(args.playlist)
      .then((pl: Playlist) => {
        evt.reply('playlist:load', pl)
        fetchPlaylistFile(pl)
          .then((pl: Playlist) => {
            // TODO use a different event here?
            evt.reply('playlist:load', pl)
          })
      })
  })

  // new AppUpdater()
}

// Playlist url format: wfmu-listener://playlists?show=12345
app.on('open-url', (evt: Electron.Event, urlStr: string) => {
  app.show()
  const purl = new URL(urlStr)
  if (purl.host === 'playlists') {
    mainWindow?.webContents.send('playlists:url-load', { url: urlStr })
  }
})

app
  .on('ready', () => {
    // Ask for accessibility
    systemPreferences.isTrustedAccessibilityClient(true)

    globalShortcut.register('MediaPlayPause', function () {
      log.debug('mediaplaypause pressed')
      mainWindow?.webContents.send('playback:playpause')
    })

    globalShortcut.register('medianexttrack', function () {
      log.debug('medianexttrack pressed')
      mainWindow?.webContents.send('playback:next')
    })

    globalShortcut.register('mediaprevioustrack', function () {
      log.debug('mediaprevioustrack pressed')
      mainWindow?.webContents.send('playback:prev')
    })

    createWindow()
    // registerProtocol()
    app.setAsDefaultProtocolClient('wfmu-listener')
    const Tray = new TrayGenerator(mainWindow!)
    Tray.createTray(getAssetPath('tray_fmu.png'))
  })
  .whenReady()
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err))
      installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err))
    }
  })

// media controls




app.allowRendererProcessReuse = true

