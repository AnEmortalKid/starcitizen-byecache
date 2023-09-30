const path = require("node:path");
const fs = require("node:fs");
const appLogger = require("./logger");

const utils = require("./utils");

function getAppData() {
  return (
    process.env.APPDATA ||
    (process.platform == "darwin"
      ? process.env.HOME + "/Library/Preferences"
      : process.env.HOME + "/.local/share")
  );
}

function getLocalAppData() {
  return (
    process.env.LOCALAPPDATA ||
    // TODO mac has way more folders apparently
    (process.platform == "darwin"
      ? process.env.HOME + "/Library/Preferences"
      : process.env.HOME + "/.local/share")
  );
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
  const shaderParent = path.resolve(getLocalAppData(), "Star Citizen");

  const deletedPaths = [];
  if (utils.safeDeleteDir(shaderParent)) {
    deletedPaths.push(shaderParent);
  }

  return { success: true, deletedPaths };
}

module.exports = {
  deleteGameShaders,
};
