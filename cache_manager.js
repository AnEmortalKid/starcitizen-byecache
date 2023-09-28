
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

module.exports = {
  deleteGameShaders
}