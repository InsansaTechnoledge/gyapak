const { contextBridge, ipcRenderer } = require('electron');

console.log("✅ preload.js loaded");

contextBridge.exposeInMainWorld('electronAPI', {
  startProctorEngine: (userId, examId, eventId) => {
    ipcRenderer.send('start-proctor-engine', { userId, examId, eventId });
  },
  stopProctorEngine: () => {
    ipcRenderer.send('stop-proctor-engine');
  },
  onProctorLog: (callback) => {
    ipcRenderer.on('proctor-log', (_event, data) => callback(data));
  }
});
