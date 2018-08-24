'use strict'

import { app, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
require('./test-runner');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 800,
    useContentSize: true,
    width: 1600
  })

  mainWindow.loadURL(winURL)
  mainWindow.maximize();

  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
// const log = require('electron-log');

// autoUpdater.logger = log;
// autoUpdater.logger.transports.file.level = 'info';
// log.info('App starting...');

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdatesAndNotify()
})

// function sendStatusToWindow (text) {
//   log.info(text);
//   // win.webContents.send('message', text);
// }
// autoUpdater.on('checking-for-update', () => {
//   sendStatusToWindow('Checking for update...');
// })
// autoUpdater.on('update-available', (info) => {
//   sendStatusToWindow('Update available.');
// })
// autoUpdater.on('update-not-available', (info) => {
//   sendStatusToWindow('Update not available.');
// })
// autoUpdater.on('error', (err) => {
//   sendStatusToWindow('Error in auto-updater. ' + err);
// })
// autoUpdater.on('download-progress', (progressObj) => {
//   let logMessage = 'Download speed: ' + progressObj.bytesPerSecond;
//   logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%';
//   logMessage = logMessage + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
//   sendStatusToWindow(logMessage);
// })
// autoUpdater.on('update-downloaded', (info) => {
//   sendStatusToWindow('Update downloaded');
// });
