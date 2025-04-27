// const { contextBridge, ipcRenderer } = require('electron');

// console.log("✅ preload.js loaded");

// contextBridge.exposeInMainWorld('electronAPI', {
//   startProctorEngine: (userId, examId, eventId) => {
//     ipcRenderer.send('start-proctor-engine', { userId, examId, eventId });
//   },
//   onProctorWarning: (callback) => ipcRenderer.on('proctor-warning', (_event, data) => callback(data)),

//   removeProctorWarningListener: () => ipcRenderer.removeAllListeners('proctor-warning'),

//   stopProctorEngine: () => {
//     ipcRenderer.send('stop-proctor-engine');
//   },
//   closeWindow: () =>
//     ipcRenderer.send('close-electron-window'),

//   onProctorLog: (callback) => {
//     ipcRenderer.on('proctor-log', (_event, data) => callback(data));
//   },
//   sendRendererReady: () => ipcRenderer.send('renderer-ready'),
//   onUserData: (callback) => ipcRenderer.on('user-data', (_event, data) => callback(data)),
 
// });

// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startProctor: (data) => ipcRenderer.send('start-proctor-engine', data),
  stopProctor: () => ipcRenderer.send('stop-proctor-engine'),
  onProctorLog: (callback) => ipcRenderer.on('proctor-log', callback),
  onProctorWarning: (callback) => ipcRenderer.on('proctor-warning', callback),
  onProctorError: (callback) => ipcRenderer.on('proctor-error', callback),
  onUserData: (callback) => ipcRenderer.on('user-data', callback),
  closeWindow: () => ipcRenderer.send('close-electron-window'),
  notifyRendererReady: () => ipcRenderer.send('renderer-ready')
});

