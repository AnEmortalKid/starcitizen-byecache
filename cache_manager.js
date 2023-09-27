
const path = require('node:path');
const fs = require('node:fs');
const appLogger = require('./logger');

function getAppData() {
  return process.env.APPDATA ||
    (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
}

function getLocalAppData() {
  return process.env.LOCALAPPDATA ||
    // TODO mac has way more folders apparently
    (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
}

/**
 * Performs cache deletion for a given version
 * 
 * @param {*} event the electron event
 * @param {string} scVersion the version of starcitizen
 * @returns {*} result.success true if the operation succeeded
 * @returns {*} result.deletedPaths set of paths that were deleted
 */
function deleteCaches(event, scVersion) {
  console.log('Deleting cache for version: ', scVersion);

  // Add more versions here if they switch things on us
  switch (scVersion) {
    case "3.20":
      return deleteCaches320();
    default:
      console.error('Unhandled version ', scVersion);
      return false;
  }
}

/**
 * Deletes a directory for us
 * @param {string} dirPath the path to the directory
 * @returns true if a path was deleted, false otherwise
 */
function safeDeleteDir(dirPath) {
  // ensure we don't delete the wrong dir
  if (dirPath && fs.existsSync(dirPath)) {
    appLogger.info('Deleting directory: ', dirPath);
    fs.rmSync(dirPath, { recursive: true })
    return true;
  }

  return false;
}

/**
 * Deletes the StarCitizen Shader folders
 */
function deleteGameShaders() {
  /**
   * The Shader folders can be found here %localappdata%\Star Citizen.
   *   https://robertsspaceindustries.com/comm-link//19456-Star-Citizen-Alpha-3200
   */
  // hope location didn't change on us but if it does we can use a switch
  const shaderParent = path.resolve(getLocalAppData(), 'Star Citizen')

  const deletedPaths = []
  if (safeDeleteDir(shaderParent)) {
    deletedPaths.push(shaderParent)
  }

  return { success: true, deletedPaths }
}

/**
* Implements deletion of the cache dirs for 3.20
*/
function deleteCaches320() {
  /**
   * Instructions from RSI website
   *   Press the Windows icon + R to open the Run command.
   *   Enter and run %appdata%\rsilauncher\logs   A folder view opens.
   *   Select and delete the Cache and GPUCache folders. Clear the trash.
   *   Right-click on your Launcher icon and select Run as Administrator.
   */
  const cacheDirPath = path.resolve(getAppData(), 'rsilauncher', 'Cache')

  const deletedPaths = []

  // ensure we don't delete the wrong dir
  if (cacheDirPath && fs.existsSync(cacheDirPath)) {
    fs.rmSync(cacheDirPath, { recursive: true })
    deletedPaths.push(cacheDirPath);
  }

  const gpuCacheDirPath = path.resolve(getAppData(), 'rsilauncher', 'GPUCache')

  // ensure we don't delete the wrong dir
  if (gpuCacheDirPath && fs.existsSync(gpuCacheDirPath)) {
    fs.rmSync(gpuCacheDirPath, { recursive: true })
    deletedPaths.push(gpuCacheDirPath);
  }

  return {
    success: true,
    deletedPaths
  };
}

module.exports = {
  deleteCaches,
  deleteGameShaders
}