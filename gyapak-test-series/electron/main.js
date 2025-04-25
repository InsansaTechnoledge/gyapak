// const { app, BrowserWindow, ipcMain } = require('electron');
// const { spawn } = require('child_process');
// const path = require('path');
// const fs = require('fs');
// const readline = require('readline');
// console.log("🧠 Electron main.js loaded from:", __filename);


// let mainWindow;
// let proctorProcess = null;

// const [, , userId, examId, eventId] = process.argv;
// console.log("✅ main.js running...");
// console.log("✅ CLI args:", userId, examId, eventId);

// function createWindow() {
//   const preloadPath = path.resolve(__dirname, 'preload.js');
//   console.log("🧠 Using preload from:", preloadPath);

//   mainWindow = new BrowserWindow({
//     // width: 1280,
//     // height: 800,
//     fullscreen: true,
//     webPreferences: {
//       preload: preloadPath,
//       contextIsolation: true,
//       nodeIntegration: false,
//       sandbox: false,
//     },
//   });

//   const url = `http://localhost:5173/test?userId=${userId}&examId=${examId}&eventId=${eventId}`;
//   mainWindow.loadURL(url);
// }

// function getBinaryPath() {
//   const isWin = process.platform === 'win32'
//   console.log(__dirname)
//   const binaryName = isWin ? 'Release/proctor_engine.exe' : 'proctor_engine'
//   const binaryPath = path.resolve(__dirname, '../../ai-proctor-engine/build', binaryName);
//   // return path.join(binDir, process.platform === 'win32' ? '../../ai-proctor-engine/build/Release/proctor_engine.exe' : '../../ai-proctor-engine/build/proctor_engine');
//   return binaryPath
// }


// // function getBinaryPath() {
// //   const binaryPath = path.resolve(__dirname, ''); // ✅ fixed
// //   console.log("🛠️ Using ProctorEngine binary at:", binaryPath);

// //   if (!fs.existsSync(binaryPath)) {
// //     throw new Error("❌ ProctorEngine binary not found. Did you run `make` in ai-proctor-engine?");
// //   }

// //   return binaryPath;
// // }




// function launchProctorEngine(userId, examId, eventId) {
//   const binaryPath = getBinaryPath();
//   console.log("🛠️ Proctor Engine Binary Path:", binaryPath);

//   proctorProcess = spawn(binaryPath, [userId, examId, eventId], {
//     stdio:['ignore', 'pipe'],
//     windowsHide: true
//   });

//   // proctorProcess.stdout.on('data', (data) => {
//   //   mainWindow?.webContents.send('proctor-log', data.toString());
//   // });

//   // proctorProcess.stdout.setEncoding('utf8');

//   // proctorProcess.stdout.on('data', (chunk) => {
//   //   const lines = chunk.toString().split('\n').filter(Boolean); // handle multiple messages
//   //   lines.forEach((message) => {
//   //     try {
//   //       const parsed = JSON.parse(message.trim());
//   //       if (parsed?.eventType === 'anomaly') {
//   //         mainWindow?.webContents.send('proctor-warning', parsed);
//   //       } else {
//   //         mainWindow?.webContents.send('proctor-log', message.trim());
//   //       }
//   //     } catch {
//   //       mainWindow?.webContents.send('proctor-log', message.trim());
//   //     }
//   //   });
//   // });
  
  
// const rl = readline.createInterface({ input: proctorProcess.stdout });

// rl.on('line', (line) => {
//   try{
//     const parsed = JSON.parse(line);
//     if(parsed?.eventType==='anomaly'){
//       mainWindow?.webContents.send('proctor-warning', parsed);
//     }
//     else{
//       mainWindow?.webContents.send('proctor-log', line);
//     }
//   }
//   catch(err){
//     console.log(err);
//     mainWindow?.webContents.send('proctor-log', line)
//   }
// })

//   proctorProcess.stderr.on('data', (data) => {
//     mainWindow?.webContents.send('proctor-log', `❌ ERROR: ${data}`);
//   });

//   proctorProcess.on('exit', (code) => {
//     mainWindow?.webContents.send('proctor-log', `🛑 Proctor Engine exited with code ${code}`);
//     proctorProcess = null;
//   });

//   proctorProcess.on('error', (err) => {
//     mainWindow?.webContents.send('proctor-log', `❌ Failed to start engine: ${err.message}`);
//     proctorProcess = null;
//   });
// }

// app.whenReady().then(() => {
//   createWindow();
// });

// // 🧠 Start from Renderer
// // ipcMain.on('start-proctor-engine', (_event, { userId, examId, eventId }) => {
// //   if (proctorProcess) {
// //     mainWindow?.webContents.send('proctor-log', '⚠️ Proctor Engine already running.');
// //     return;
// //   }

// //   console.log('🔥 Starting Proctor Engine from IPC...');
// //   launchProctorEngine(userId, examId, eventId);
// // });

// ipcMain.on('start-proctor-engine', (_event, { userId, examId, eventId }) => {
//   if (proctorProcess) {
//     mainWindow?.webContents.send('proctor-log', '⚠️ Proctor Engine already running.');
//     return;
//   }

//   console.log('🔥 Starting Proctor Engine from IPC...');

//   // ✅ Navigate to /test-page when starting the proctor engine
//   const testPageUrl = `http://localhost:5173/test-page?userId=${userId}&examId=${examId}&eventId=${eventId}`;
//   mainWindow?.loadURL(testPageUrl);

//   // ✅ Then start the proctor engine
//   launchProctorEngine(userId, examId, eventId);
// });


// // 🔴 Stop command from Renderer
// ipcMain.on('stop-proctor-engine', () => {
//   if (proctorProcess) {
//     proctorProcess.kill('SIGINT');
//     proctorProcess = null;
//     console.log("🛑 Proctor Engine stopped.");
//   }
// });

// ipcMain.on('close-electron-window', async () => {
//   console.log("🛑 Received request to close Electron window");

//   if (proctorProcess) {
//     proctorProcess.kill('SIGINT');
//     proctorProcess = null;
//   }

//   if (mainWindow && !mainWindow.isDestroyed()) {
//     // Open external URL before closing
//     // const redirectURL = `http://localhost:5173/exam/${examId}`;
//     // await shell.openExternal(redirectURL);
//     console.log("main closed");
//     mainWindow.close();
//   }

//   // if (mainWindow && !mainWindow.isDestroyed()) {
//   //   mainWindow.close();
//   // }
// });



// // Cleanup
// app.on('window-all-closed', () => {
//   if (proctorProcess) {
//     proctorProcess.kill('SIGTERM');
//     proctorProcess = null;
//   }
//   if (process.platform !== 'darwin') app.quit();
// });

// ipcMain.on('window-blurred', () => {
//   console.log("⚠️ Electron window lost focus (tab changed or minimized)");
//   mainWindow?.webContents.send('proctor-log', '⚠️ Window focus lost');
// });

// ipcMain.on('window-focused', () => {
//   console.log("✅ Electron window regained focus");
//   mainWindow?.webContents.send('proctor-log', '✅ Window focus regained');
// });

const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

let mainWindow;
let proctorProcess = null;

const [, , userId, examId, eventId] = process.argv;

function safeSend(channel, data) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, data);
  }
}

function closeUnwantedApps() {
  const platform = process.platform;

  console.log(platform);

  // uncomment this in production

  // if (platform === 'darwin') {
  //   // macOS
  //   const appsToKill = ['Safari', 'Google Chrome'];
  //   appsToKill.forEach(app => {
  //     exec(`osascript -e 'quit app "${app}"'`, (err) => {
  //       if (err) console.warn(`⚠️ Failed to quit ${app}:`, err.message);
  //       else console.log(`✅ ${app} closed.`);
  //     });
  //   });
  // } else if (platform === 'win32') {
  //   // Windows
  //   const processesToKill = ['chrome.exe'];
  //   processesToKill.forEach(proc => {
  //     exec(`taskkill /IM ${proc} /F`, (err) => {
  //       if (err) console.warn(`⚠️ Failed to kill ${proc}:`, err.message);
  //       else console.log(`✅ ${proc} terminated.`);
  //     });
  //   });
  // }
  
}

function createWindow() {
  const preloadPath = path.resolve(__dirname, 'preload.js');
  mainWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const url = `http://localhost:5173/test?userId=${userId}&examId=${examId}&eventId=${eventId}`;
  mainWindow.loadURL(url);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  closeUnwantedApps(); // 👈 Kill apps once window is created
}

function getBinaryPath() {

  const isWin = process.platform === 'win32';
  const binaryName = isWin ? 'Release/proctor_engine.exe' : 'proctor_engine';
  const binPath = path.resolve(__dirname, '../../ai-proctor-engine/build', binaryName);
  console.log(binPath , ':/')
  return binPath
}

function launchProctorEngine(userId, examId, eventId) {
  const binaryPath = getBinaryPath();
  proctorProcess = spawn(binaryPath, [userId, examId, eventId], {
    stdio: ['ignore', 'pipe'],
    windowsHide: true,
  });

  const rl = readline.createInterface({ input: proctorProcess.stdout });

  rl.on('line', (line) => {
    try {
      const parsed = JSON.parse(line);
      if (parsed?.eventType === 'anomaly') {
        safeSend('proctor-warning', parsed);
      } else {
        safeSend('proctor-log', line);
      }
    } catch {
      safeSend('proctor-log', line);
    }
  });

  proctorProcess.stderr.on('data', (data) => {
    safeSend('proctor-log', `❌ ERROR: ${data}`);
  });

  proctorProcess.on('exit', (code) => {
    safeSend('proctor-log', `🛑 Proctor Engine exited with code ${code}`);
    proctorProcess = null;
  });

  proctorProcess.on('error', (err) => {
    safeSend('proctor-log', `❌ Failed to start engine: ${err.message}`);
    proctorProcess = null;
  });
}

app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disk-cache-size', '0');
app.disableHardwareAcceleration();

app.whenReady().then(() => {
  createWindow();
});

ipcMain.on('start-proctor-engine', (_event, { userId, examId, eventId }) => {
  if (proctorProcess) {
    safeSend('proctor-log', '⚠️ Proctor Engine already running.');
    return;
  }

  const testPageUrl = `http://localhost:5173/test-page?userId=${userId}&examId=${examId}&eventId=${eventId}`;
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.loadURL(testPageUrl);
  }

  launchProctorEngine(userId, examId, eventId);
});

ipcMain.on('stop-proctor-engine', () => {
  if (proctorProcess) {
    proctorProcess.kill('SIGINT');
    proctorProcess = null;
    console.log("🛑 Proctor Engine stopped.");
  }
});

ipcMain.on('close-electron-window', () => {
  if (proctorProcess) {
    proctorProcess.kill('SIGINT');
    proctorProcess = null;
  }

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close();
  }
});

app.on('window-all-closed', () => {
  if (proctorProcess) {
    proctorProcess.kill('SIGTERM');
    proctorProcess = null;
  }
  if (process.platform !== 'darwin') app.quit();
});
