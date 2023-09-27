const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const fs = require('node:fs')

const cacheManager = require('./cache_manager')

const appVersion = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "package.json"))
).version;

// TODO remove the tools bar if not dev
// TODO squirrel loader
// TODO do the file exit stuff we did in avocapture
// TODo put this in a app js file main handles the squirrel js stuff (autoupdater)
// rename to byecache


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
    win.setTitle("StarCitizen Cache Manager " + appVersion);
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.whenReady().then(() => {

  ipcMain.handle('cacheManager.delete', cacheManager.deleteCaches);

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})