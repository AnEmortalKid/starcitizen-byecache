const path = require('node:path');
const fs = require('node:fs');
const appLogger = require('./logger');

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

function safeDeleteDirectoryContents(dirPath) {
  const dirLocation = path.resolve(dirPath);

  // get file types to determine what we do
  const dirEntries = fs.readdirSync(dirLocation, { withFileTypes: true });

  dirEntries.forEach(entry => {
    const entryPath = path.resolve(dirLocation, entry.name);
    if (entry.isDirectory()) {
      safeDeleteDir(entryPath);
    }

    if (entry.isFile()) {
      fs.rmSync(entryPath);
    }
  });

}

module.exports = {
  safeDeleteDir,
  safeDeleteDirectoryContents
}