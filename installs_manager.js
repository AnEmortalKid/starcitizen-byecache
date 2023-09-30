
const { uuid } = require('uuidv4');
const path = require('node:path');
const fs = require('node:fs');

const appSettings = require('./app_settings');
const utils = require('./utils');

const locationsKey = 'installs';

// 3.20 locations still contain these
const MAPPINGS_SUBDIRS = "USER/Client/0/Controls/Mappings"
const USER_SUBDIR = "USER";

function findByLocation(installs, folderPath) {
  return installs.find((elem) => elem.location === folderPath);
}

function findById(installs, id) {
  return installs.find((elem) => elem.id === id);
}

// status: success, data: obj (or null) if no changed
// status: error, data: failure

function addInstallLocation(folderPath) {
  // todo add whether updated or not

  // require its the parent of the user folder
  const userPath = path.resolve(folderPath, 'USER')
  if (!fs.existsSync(userPath)) {
    return {
      success: false,
      error: "Directory selected does not contain a USER folder"
    };
  }

  const installs = appSettings.get(locationsKey, []);

  const existing = findByLocation(installs, folderPath);
  if (existing) {
    return {
      success: true
    };
  }

  const newInstall = {
    id: uuid(),
    location: folderPath,
  }
  installs.push(newInstall);
  appSettings.set(locationsKey, installs);

  return {
    success: true, data: newInstall
  }
}

function removeInstallLocation(id) {
  const installs = appSettings.get(locationsKey, []);

  const updated = installs.filter(item => item.id !== id);
  appSettings.set(locationsKey, updated);
}

function getInstallLocations() {
  return appSettings.get(locationsKey, []);
}

function setBackup(installId, backupPath) {

  const installs = appSettings.get(locationsKey, []);

  const found = findById(installs, installId);
  if (!found) {
    // TODO return some status or a filter or something
    return false;
  }

  found.backup = backupPath;
  appSettings.set(locationsKey, installs);
}

function removeBackup(installId) {
  const installs = appSettings.get(locationsKey, []);

  const found = findById(installs, installId);
  if (!found) {
    // TODO return some status or a filter or something
    return false;
  }

  delete found.backup
  appSettings.set(locationsKey, installs);
}

function purgeInstall(installId) {
  const installs = appSettings.get(locationsKey, []);
  const found = findById(installs, installId);

  if (!found) {
    // todo status
    return;
  }

  // only backup if we specified stuff
  if (found.backup) {
    backupFiles(found.location, found.backup);
  }

  // delete the files inside the user dir
  const userDIR = path.resolve(found.location, USER_SUBDIR);
  utils.safeDeleteDirectoryContents(userDIR);
}

function backupFiles(location, backup) {
  const mappingsDir = path.resolve(location, MAPPINGS_SUBDIRS);

  // if we purged previously, these won't exist
  if (fs.existsSync(mappingsDir)) {
    // copy and overwrite files
    fs.cpSync(mappingsDir, backup, { force: true, recursive: true });
  }
}

module.exports = {
  addInstallLocation,
  removeInstallLocation,
  getInstallLocations,
  setBackup,
  removeBackup,
  purgeInstall
}
