
const appSettings = require('./app_settings');
const { uuid } = require('uuidv4');
const path = require('node:path');
const fs = require('node:fs');

const locationsKey = 'installs';

function findByLocation(installs, folderPath) {
  return installs.find((elem) => elem.location === folderPath);
}

function addInstallLocation(folderPath) {
  // todo add whether updated or not

  // require its the parent of the user folder
  const userPath = path.resolve(folderPath, 'USER')
  if (!fs.existsSync(userPath)) {
    // TODO return some status or a filter or something
    // todo return status { success: false, error: msg or something }
    return false;
  }

  const installs = appSettings.get(locationsKey, []);

  const existing = findByLocation(installs, folderPath);
  if (existing) {
    return;
  }

  const newInstall = {
    id: uuid(),
    location: folderPath,
  }
  installs.push(newInstall);
  appSettings.set(locationsKey, installs);
}

// todo update to id?
function removeInstallLocation(folderPath) {
  const installs = appSettings.get(locationsKey, []);
  const updated = installs.filter(item => item.location !== folderPath);
  appSettings.set(locationsKey, updated);
}

function getInstallLocations() {
  return appSettings.get(locationsKey, []);
}

module.exports = {
  addInstallLocation,
  removeInstallLocation,
  getInstallLocations
}
