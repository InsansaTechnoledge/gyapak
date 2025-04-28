const { contextBridge, ipcRenderer } = require('electron');

console.log("✅ preload.js loaded");


contextBridge.exposeInMainWorld('electronAPI', {
  startProctorEngine: (userId, examId, eventId) => {
    ipcRenderer.send('start-proctor-engine', { userId, examId, eventId });
  },
  onProctorWarning: (callback) => {
    ipcRenderer.removeAllListeners('proctor-warning');
    ipcRenderer.on('proctor-warning', (_event, data) => callback(data));
  },
  removeProctorWarningListener: () => {
    ipcRenderer.removeAllListeners('proctor-warning');
  },
  onProctorEvent: (callback) => {
    ipcRenderer.removeAllListeners('proctor-event');
    ipcRenderer.on('proctor-event', (_event, data) => callback(data));
  },
  removeProctorEventListener: () => {
    ipcRenderer.removeAllListeners('proctor-event');
  },
  stopProctorEngine: () => {
    ipcRenderer.send('stop-proctor-engine');
  },
  closeWindow: () => {
    ipcRenderer.send('close-electron-window');
  },

  // 🧹 THIS WAS MISSING 👇👇👇
  sendRendererReady: () => {
    ipcRenderer.send('renderer-ready');
  },

  onUserData: (callback) => {
    ipcRenderer.on('user-data', (_event, data) => callback(data));
  },
});


// contextBridge.exposeInMainWorld('electronAPI', {
//   startProctorEngine: (userId, examId, eventId) => {
//     ipcRenderer.removeAllListeners('proctor-warning'); 
//     ipcRenderer.send('start-proctor-engine', { userId, examId, eventId });
//   },
//   onProctorWarning: (callback) => {
//     ipcRenderer.removeAllListeners('proctor-warning'); 
//     ipcRenderer.on('proctor-warning', (_event, data) => callback(data));
//   },
//   removeProctorWarningListener: () => ipcRenderer.removeAllListeners('proctor-warning'),

//   stopProctorEngine: () => {
//     ipcRenderer.send('stop-proctor-engine');
//   },
//   closeWindow: () =>
//     ipcRenderer.send('close-electron-window'),

//   onProctorLog: (callback) => {
//     ipcRenderer.on('proctor-log', (_event, data) => callback(data));
//   },
//   onProctorEvent: (callback) => {
//     ipcRenderer.on('proctor-event', (_event, data) => {
//       console.log("📥 preload proctor-event:", data);
//       callback(data);
//     });
//   },
//   removeProctorEventListener: () => ipcRenderer.removeAllListeners('proctor-event'),
  
//   sendRendererReady: () => ipcRenderer.send('renderer-ready'),
//   onUserData: (callback) => ipcRenderer.on('user-data', (_event, data) => callback(data)),
 
// });

// preload.js
// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('electronAPI', {
//     startProctorEngine: (userId, examId, eventId) => {
//         ipcRenderer.send('start-proctor-engine', { userId, examId, eventId });
//       },
//   stopProctor: () => ipcRenderer.send('stop-proctor-engine'),
//   onProctorLog: (callback) => ipcRenderer.on('proctor-log', callback),
//   onProctorWarning: (callback) => ipcRenderer.on('proctor-warning', callback),
//   onProctorError: (callback) => ipcRenderer.on('proctor-error', callback),
// //   onUserData: (callback) => ipcRenderer.on('user-data', callback),
//   closeWindow: () => ipcRenderer.send('close-electron-window'),
//   notifyRendererReady: () => ipcRenderer.send('renderer-ready'),
//   sendRendererReady: () => ipcRenderer.send('renderer-ready'),
//   onUserData: (callback) => ipcRenderer.on('user-data', (_event, data) => callback(data)),
// });

