// src/preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getTokens: () => ipcRenderer.invoke('get-tokens'),
  openExternal: (url) => ipcRenderer.send('open-external', url),
  loginWithGoogle: () => ipcRenderer.invoke('login-with-google'),
  onLoginSuccess: (callback) => ipcRenderer.on('login-success', callback),
  getFolders: () => ipcRenderer.invoke('get-folders'),
  saveFolders: (folders) => ipcRenderer.invoke('save-folders', folders),
  goBack: () => ipcRenderer.invoke('go-back'),
});
