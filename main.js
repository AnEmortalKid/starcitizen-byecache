const { app } = require("electron");

if (require("electron-squirrel-startup")) {
  app.quit();
}

const log = require("electron-log");
require("update-electron-app")({
  logger: log.scope("update-electron-app"),
});

const bycacheApp = require("./byecache_app");

bycacheApp.runApp();
