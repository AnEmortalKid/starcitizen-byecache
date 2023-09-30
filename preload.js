const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('cacheManager', {
  delete: (scVersion) => ipcRenderer.invoke('cacheManager.delete', scVersion),
  deleteShaders: () => ipcRenderer.invoke('cacheManager.shaders.delete')
});


const shadersAPI = {
  deleteShaders: () => ipcRenderer.invoke('cacheManager.shaders.delete')
}

const directoryAPI = {
  select: () => ipcRenderer.invoke('directory.select')
}

const installsAPI = {
  add: (path) => ipcRenderer.invoke('installs.add', path),
  remove: (id) => ipcRenderer.invoke('installs.remove', id),
  get: () => ipcRenderer.invoke('installs.get'),
  setBackup: (id, path) => ipcRenderer.invoke('installs.backup.add', id, path),
  removeBackup: (id) => ipcRenderer.invoke('installs.backup.remove', id),
  purge: (id) => ipcRenderer.invoke('installs.purge', id)
}

contextBridge.exposeInMainWorld('byecache', {
  directory: directoryAPI,
  shaders: shadersAPI,
  installs: installsAPI
});
