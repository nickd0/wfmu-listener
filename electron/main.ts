import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import * as url from 'url'
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'
import TrayGenerator from "./tray";
import { PlaylistFeedItem } from "./feed";


import PlaylistFeed from "./feed";

//TODO
// require('crash-reporter').start();

let mainWindow: Electron.BrowserWindow | null

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 600,
    show: false,
    alwaysOnTop: true,
    frame: false,
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
    let fr = new PlaylistFeed();
    fr.fetchFeed()
      .then((playlists: Array<PlaylistFeedItem>) => {
        mainWindow?.webContents.send('PLAYLISTS_LOADED', { playlists })
      })
  });

  mainWindow.on('blur', () => {
    // mainWindow?.hide()
  })
}

app.on('ready', () => {
    createWindow();
    const Tray = new TrayGenerator(mainWindow!);
    Tray.createTray();
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

app.allowRendererProcessReuse = true
