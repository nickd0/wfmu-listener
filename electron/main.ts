import { app, BrowserWindow, ipcMain, globalShortcut, protocol } from 'electron'
import * as path from 'path'
import * as url from 'url'
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'
import TrayGenerator from "./tray";


import PlaylistFeed from './feed';
import Playlist, { fetchPlaylistInfo, fetchPlaylistFile } from './playlist'
import { electron } from 'process';

//TODO
// require('crash-reporter').start();

let mainWindow: Electron.BrowserWindow | null

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 600,
    show: false,
    alwaysOnTop: true,
    resizable: false,
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
    createWindow()
    // registerProtocol()
    app.setAsDefaultProtocolClient('wfmu-listener')
    const Tray = new TrayGenerator(mainWindow!)
    Tray.createTray()
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

let registered = globalShortcut.register('mediaplaypause', function () {
  console.log('mediaplaypause pressed')
})
if (!registered) {
  console.log('mediaplaypause registration failed')
} else {
  console.log('mediaplaypause registration bound!')
}



app.allowRendererProcessReuse = true

