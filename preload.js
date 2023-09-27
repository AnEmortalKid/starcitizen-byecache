const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('cacheManager', {
  delete: (scVersion) => ipcRenderer.send('cacheManager.delete', scVersion)
});
