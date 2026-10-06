const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('capture', {
  getState: () => ipcRenderer.invoke('get-state'),
  signIn: () => ipcRenderer.invoke('sign-in'),
  signOut: () => ipcRenderer.invoke('sign-out'),
  saveTask: (title) => ipcRenderer.invoke('save-task', title),
  openBoard: (board) => ipcRenderer.invoke('open-board', board),
  hide: () => ipcRenderer.invoke('hide'),
  onSession: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('session', listener);
    return () => ipcRenderer.removeListener('session', listener);
  }
});
