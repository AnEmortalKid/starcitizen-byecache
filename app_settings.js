const Store = require("electron-store");
const store = new Store({
  name: "starcitizen-byecache",
  cwd: "settings",
  clearInvalidConfig: true,
});

module.exports = store;
