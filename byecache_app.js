const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const appLogger = require("./logger");
const cacheManager = require("./cache_manager");
const installsManager = require("./installs_manager");

const appSettings = require("./app_settings");

const appVersion = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "package.json")),
).version;

let mainWindow;

async function selectDirectory() {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });

  if (!canceled) {
    return filePaths[0];
  }
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");

  win.webContents.on("did-finish-load", () => {
    win.setTitle("StarCitizen Byecache v" + appVersion);
  });
};

function runApp() {
  appLogger.info("Starting App");

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.whenReady().then(() => {
    ipcMain.handle(
      "cacheManager.shaders.delete",
      cacheManager.deleteGameShaders,
    );
    ipcMain.handle("directory.select", selectDirectory);

    ipcMain.handle("installs.add", (evt, path) => {
      return installsManager.addInstallLocation(path);
    });
    ipcMain.handle("installs.remove", (evt, id) => {
      installsManager.removeInstallLocation(id);
    });
    ipcMain.handle("installs.get", installsManager.getInstallLocations);
    ipcMain.handle("installs.purge", (evt, id) => {
      installsManager.purgeInstall(id);
    });
    ipcMain.handle("installs.backup.add", (evt, id, path) =>
      installsManager.setBackup(id, path),
    );
    ipcMain.handle("installs.backup.remove", (evt, id) =>
      installsManager.removeBackup(id),
    );

    mainWindow = createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

module.exports = {
  runApp,
};
