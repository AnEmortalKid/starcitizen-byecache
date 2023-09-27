const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const fs = require('node:fs')

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
    win.setTitle("StarCitizen Cache Manager " + appVersion);
  });
}

function deleteCaches(event, scVersion) {
  console.log('scVersion ', scVersion);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.whenReady().then(() => {

  ipcMain.on('cacheManager.delete', deleteCaches);

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})