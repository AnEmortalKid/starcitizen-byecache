
const path = require('node:path')
const fs = require('node:fs')

function getAppData() {
  return process.env.APPDATA ||
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
}