// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('electronAPI', {
//   // Start the AI Proctor Engine with arguments
//   startProctorEngine: (userId, examId) => {
//     ipcRenderer.send('start-proctor-engine', { userId, examId });
//   },

//   // Stop the AI Proctor Engine
//   stopProctorEngine: () => {
//     ipcRenderer.send('stop-proctor-engine');
//   },

//   // Receive log updates from backend
//   onProctorLog: (callback) => {
//     ipcRenderer.on('proctor-log', (_event, data) => {
//       callback(data);
//     });
//   }
// });

const { contextBridge, ipcRenderer } = require('electron');

console.log("preload script");
contextBridge.exposeInMainWorld('electronAPI', {
  startProctorEngine: (userId, examId, eventId) => {
    ipcRenderer.send('start-proctor-engine', { userId, examId, eventId });
  },
  stopProctorEngine: () => {
    ipcRenderer.send('stop-proctor-engine');
  },
  onProctorLog: (callback) => {
    ipcRenderer.on('proctor-log', (_event, data) => {
      callback(data);
    });
  }
});