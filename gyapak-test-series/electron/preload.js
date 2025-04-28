const { contextBridge, ipcRenderer } = require('electron');

console.log("✅ preload.js loaded");
const userId = '68022a95181d6d38d41fbc4b';
const examId = '3ea70332-a6dc-49a0-aede-56208f580fb1';
const eventId = '4fba7d24-d8ad-4320-be0b-0dca9b861fe4';


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



