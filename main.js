const { app } = require("electron");

if (require("electron-squirrel-startup")) {
  app.quit();
}

const log = require("electron-log");
require("update-electron-app")({
  logger: log.scope("update-electron-app"),
});

const bycacheApp = require('./byecache_app');


// // TODO squirrel loader

bycacheApp.runApp();

// const { app, BrowserWindow, ipcMain } = require('electron')
// const path = require('node:path')
// const fs = require('node:fs')

// const cacheManager = require('./cache_manager')

// const appVersion = JSON.parse(
//   fs.readFileSync(path.resolve(__dirname, "package.json"))
// ).version;

// // TODO remove the tools bar if not dev

// // TODO do the file exit stuff we did in avocapture
