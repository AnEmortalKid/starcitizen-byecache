const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('cacheManager', {
  delete: (scVersion) => ipcRenderer.invoke('cacheManager.delete', scVersion)
});
