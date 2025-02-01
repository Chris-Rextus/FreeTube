// src/preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url) => ipcRenderer.send('open-external', url),
  loginWithGoogle: () => ipcRenderer.invoke('login-with-google'),
  onLoginSuccess: (callback) => ipcRenderer.on('login-success', callback),
});