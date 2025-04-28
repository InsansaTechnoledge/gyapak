const { contextBridge, ipcRenderer } = require('electron');

console.log("✅ preload.js loaded");


contextBridge.exposeInMainWorld('electronAPI', {
  startProctorEngine: (userId, examId, eventId) => {
    ipcRenderer.send('start-proctor-engine', { userId, examId, eventId });
  },
  onProctorWarning: (callback) => ipcRenderer.on('proctor-warning', (_event, data) => callback(data)),

  removeProctorWarningListener: () => ipcRenderer.removeAllListeners('proctor-warning'),

  stopProctorEngine: () => {
    ipcRenderer.send('stop-proctor-engine');
  },
  closeWindow: () =>
    ipcRenderer.send('close-electron-window'),

  onProctorLog: (callback) => {
    ipcRenderer.on('proctor-log', (_event, data) => callback(data));
  }
});



