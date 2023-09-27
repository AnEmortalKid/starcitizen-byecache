const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const appLogger = require('./logger');
const cacheManager = require('./cache_manager');

const appSettings = require('./app_settings');

const appVersion = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "package.json"))
).version;


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html')

  win.webContents.on("did-finish-load", () => {
    win.setTitle("StarCitizen Byecache v" + appVersion);
  });
}

function runApp() {
  appLogger.info('Starting App');

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.whenReady().then(() => {

    ipcMain.handle('cacheManager.delete', cacheManager.deleteCaches);
    ipcMain.handle('cacheManager.shaders.delete', cacheManager.deleteGameShaders);

    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })
}


module.exports = {
  runApp
}