
const appSettings = require('./app_settings');

const locationsKey = 'installLocations';

function addInstallLocation(folderPath) {
  // todo add whether updated or not
  const existing = appSettings.get(locationsKey, []);

  if (!existing.includes(folderPath)) {
    existing.push(folderPath);
    appSettings.set(locationsKey, existing);
  }
}

function removeInstallLocation(folderPath) {
  const existing = appSettings.get(locationsKey, []);
  const updated = existing.filter(item => item !== folderPath);
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
