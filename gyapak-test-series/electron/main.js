const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("🧠 Electron main.js loaded from:", __filename);


let mainWindow;
let proctorProcess = null;

const [, , userId, examId, eventId] = process.argv;
console.log("✅ main.js running...");
console.log("✅ CLI args:", userId, examId, eventId);

function createWindow() {
  const preloadPath = path.resolve(__dirname, 'preload.js');
  console.log("🧠 Using preload from:", preloadPath);

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const url = `http://localhost:5173/test?userId=${userId}&examId=${examId}&eventId=${eventId}`;
  mainWindow.loadURL(url);
}

function getBinaryPath() {
  const isWin = process.platform === 'win32'
  console.log(__dirname)
  const binaryName = isWin ? 'Release/proctor_engine.exe' : 'proctor_engine'
  const binaryPath = path.resolve(__dirname, '../../ai-proctor-engine/build', binaryName);
  // return path.join(binDir, process.platform === 'win32' ? '../../ai-proctor-engine/build/Release/proctor_engine.exe' : '../../ai-proctor-engine/build/proctor_engine');
  return binaryPath
}


// function getBinaryPath() {
//   const binaryPath = path.resolve(__dirname, ''); // ✅ fixed
//   console.log("🛠️ Using ProctorEngine binary at:", binaryPath);

//   if (!fs.existsSync(binaryPath)) {
//     throw new Error("❌ ProctorEngine binary not found. Did you run `make` in ai-proctor-engine?");
//   }

//   return binaryPath;
// }




function launchProctorEngine(userId, examId, eventId) {
  const binaryPath = getBinaryPath();
  console.log("🛠️ Proctor Engine Binary Path:", binaryPath);

  proctorProcess = spawn(binaryPath, [userId, examId, eventId]);

  // proctorProcess.stdout.on('data', (data) => {
  //   mainWindow?.webContents.send('proctor-log', data.toString());
  // });

  proctorProcess.stdout.on('data', (data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('proctor-log', data.toString());
    }
  });

  proctorProcess.stderr.on('data', (data) => {
    mainWindow?.webContents.send('proctor-log', `❌ ERROR: ${data}`);
  });

  proctorProcess.on('exit', (code) => {
    mainWindow?.webContents.send('proctor-log', `🛑 Proctor Engine exited with code ${code}`);
    proctorProcess = null;
  });

  proctorProcess.on('error', (err) => {
    mainWindow?.webContents.send('proctor-log', `❌ Failed to start engine: ${err.message}`);
    proctorProcess = null;
  });
}

app.whenReady().then(() => {
  createWindow();
});

// 🧠 Start from Renderer
// ipcMain.on('start-proctor-engine', (_event, { userId, examId, eventId }) => {
//   if (proctorProcess) {
//     mainWindow?.webContents.send('proctor-log', '⚠️ Proctor Engine already running.');
//     return;
//   }

//   console.log('🔥 Starting Proctor Engine from IPC...');
//   launchProctorEngine(userId, examId, eventId);
// });

ipcMain.on('start-proctor-engine', (_event, { userId, examId, eventId }) => {
  if (proctorProcess) {
    mainWindow?.webContents.send('proctor-log', '⚠️ Proctor Engine already running.');
    return;
  }

  console.log('🔥 Starting Proctor Engine from IPC...');

  // ✅ Navigate to /test-page when starting the proctor engine
  const testPageUrl = `http://localhost:5173/test-page?userId=${userId}&examId=${examId}&eventId=${eventId}`;
  mainWindow?.loadURL(testPageUrl);

  // ✅ Then start the proctor engine
  launchProctorEngine(userId, examId, eventId);
});


// 🔴 Stop command from Renderer
ipcMain.on('stop-proctor-engine', () => {
  if (proctorProcess) {
    proctorProcess.kill('SIGINT');
    proctorProcess = null;
    console.log("🛑 Proctor Engine stopped.");
  }
});

ipcMain.on('close-electron-window', async () => {
  console.log("🛑 Received request to close Electron window");

  if (proctorProcess) {
    proctorProcess.kill('SIGINT');
    proctorProcess = null;
  }

  if (mainWindow && !mainWindow.isDestroyed()) {
    // Open external URL before closing
    // const redirectURL = `http://localhost:5173/exam/${examId}`;
    // await shell.openExternal(redirectURL);

    mainWindow.close();
  }

  // if (mainWindow && !mainWindow.isDestroyed()) {
  //   mainWindow.close();
  // }
});



// Cleanup
app.on('window-all-closed', () => {
  if (proctorProcess) {
    proctorProcess.kill('SIGTERM');
    proctorProcess = null;
  }
  if (process.platform !== 'darwin') app.quit();
});
