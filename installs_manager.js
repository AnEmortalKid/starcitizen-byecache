const { uuid } = require("uuidv4");
const path = require("node:path");
const fs = require("node:fs");

const appLogger = require("./logger");
const appSettings = require("./app_settings");
const utils = require("./utils");

const locationsKey = "installs";

// 3.20 locations still contain these
const MAPPINGS_SUBDIRS = "USER/Client/0/Controls/Mappings";
const USER_SUBDIR = "USER";

function findByLocation(installs, folderPath) {
  return installs.find((elem) => elem.location === folderPath);
}

function findById(installs, id) {
  return installs.find((elem) => elem.id === id);
}

/**
 * Install definition.
 * @typedef {Object} InstallManagerInstall
 * @property {string} id - identifier for this install
 * @property {string} location - parent directory of a StarCitizen USER folder
 * @property {string} backup - directory where files should be backed up to (may be null)
 */

/**
 * Result of an install operation.
 * @typedef {Object} InstallManagerResponse
 * @property {boolean} success - whether the operation succeeded or not
 * @property {...InstallManagerInstall} data - created/updated install value for a given install or null if the operation caused no updates
 * @property {string} error - Error message when an operation did not succeed due to errors
 */

/**
 * Adds a new install definition with the give location path
 * @param {*} folderPath the parent folder where a USER directory exists
 * @returns {...InstallManagerResponse} {@link InstallManagerResponse} based on the result of this operation
 */
function addInstallLocation(folderPath) {
  // require its the parent of the user folder
  const userPath = path.resolve(folderPath, "USER");
  if (!fs.existsSync(userPath)) {
    return {
      success: false,
      error: "Directory selected does not contain a USER folder.",
    };
  }

  const installs = appSettings.get(locationsKey, []);

  const existing = findByLocation(installs, folderPath);
  if (existing) {
    return {
      success: true,
    };
  }

  const newInstall = {
    id: uuid(),
    location: folderPath,
  };
  installs.push(newInstall);
  appSettings.set(locationsKey, installs);

  return {
    success: true,
    data: newInstall,
  };
}

/**
 * Removes an install based on its identifier
 * @param {string} id - identifier for the {@link InstallManagerInstall}
 */
function removeInstallLocation(id) {
  const installs = appSettings.get(locationsKey, []);

  const updated = installs.filter((item) => item.id !== id);
  appSettings.set(locationsKey, updated);
}

/**
 * @returns the set of all {@link InstallManagerInstall installs}
 */
function getInstallLocations() {
  return appSettings.get(locationsKey, []);
}

/**
 * Associates the provided directory as the backup location for an install
 * @param {string} installId identifier for the {@link InstallManagerInstall install}
 * @param {string} backupPath path to the backup directory for this install
 * @returns {...InstallManagerResponse} {@link InstallManagerResponse response} with the result of the operation
 */
function setBackup(installId, backupPath) {
  appLogger.info(
    "[setBackup]",
    "storing ",
    backupPath,
    "as backup for ",
    installId,
  );

  const installs = appSettings.get(locationsKey, []);

  const found = findById(installs, installId);
  if (!found) {
    appLogger.info(
      "[setBackup]",
      "Could not find an install with id: ",
      installId,
    );
    return {
      success: false,
      error: "The provided install could not be found.",
    };
  }

  found.backup = backupPath;
  appSettings.set(locationsKey, installs);

  return {
    success: true,
    data: found,
  };
}

/**
 * Removes the associated backup directory for an install
 * @param {string} installId identifier for the {@link InstallManagerInstall install}
 * @returns {...InstallManagerResponse} {@link InstallManagerResponse response} with the result of the operation
 */
function removeBackup(installId) {
  const installs = appSettings.get(locationsKey, []);

  const found = findById(installs, installId);
  if (!found) {
    appLogger.info(
      "[removeBackup]",
      "Could not find an install with id: ",
      installId,
    );
    return {
      success: false,
      error: "The provided install could not be found.",
    };
  }

  delete found.backup;
  appSettings.set(locationsKey, installs);

  return {
    success: true,
    data: found,
  };
}

/**
 * Removes the USER directory contents for a givne install
 *
 * @param {string} installId - the identifier of {@link InstallManagerInstall install}
 * @returns {...InstallManagerResponse} {@link InstallManagerResponse response} with the result of the operation
 */
function purgeInstall(installId) {
  const installs = appSettings.get(locationsKey, []);

  const found = findById(installs, installId);
  if (!found) {
    appLogger.info(
      "[purgeInstall]",
      "Could not find an install with id: ",
      installId,
    );
    return {
      success: false,
      error: "The provided install could not be found.",
    };
  }

  appLogger.info("[purgeInstall]", "operating on", JSON.stringify(found));

  // only backup if we specified stuff
  if (found.backup) {
    appLogger.info(
      "[purgeInstall]",
      "Backing up ",
      found.location,
      " to ",
      found.backup,
    );
    backupFiles(found.location, found.backup);
  }

  // delete the files inside the user dir
  const userDIR = path.resolve(found.location, USER_SUBDIR);
  utils.safeDeleteDirectoryContents(userDIR);

  return { success: true };
}

function backupFiles(location, backup) {
  const mappingsDir = path.resolve(location, MAPPINGS_SUBDIRS);

  // if we purged previously, these won't exist
  appLogger.info("[backupFiles]", "Searching for mappings ", mappingsDir);
  if (!fs.existsSync(mappingsDir)) {
    appLogger.info(
      "[backupFiles]",
      "Mappings directory did not exist in",
      location,
    );
    return;
  }

  // copy all files in that dir to the backup
  const dirContents = fs.readdirSync(mappingsDir, { withFileTypes: true });
  appLogger.info("[backupFiles]", "Backing up", dirContents.length, "files");

  dirContents.forEach((dirent) => {
    if (dirent.isFile()) {
      const src = path.join(mappingsDir, dirent.name);
      const dest = path.join(backup, dirent.name);
      appLogger.info("[backupFiles]", "Copying", src, "to", dest);
      fs.copyFileSync(src, dest);
    }
  });
}

module.exports = {
  addInstallLocation,
  removeInstallLocation,
  getInstallLocations,
  setBackup,
  removeBackup,
  purgeInstall,
};
