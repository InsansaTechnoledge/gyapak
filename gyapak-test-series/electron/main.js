const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

let mainWindow;
let proctorProcess = null;

if (!app.isDefaultProtocolClient('gyapak')) {
  app.setAsDefaultProtocolClient('gyapak');
}

// const [, , userId, examId, eventId] = process.argv;

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

function createWindow(userId, examId, eventId) {
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

// function getBinaryPath() {

//   const isWin = process.platform === 'win32';
//   const binaryName = isWin ? 'Release/proctor_engine.exe' : 'proctor_engine';
//   return path.resolve(__dirname, '../../ai-proctor-engine/build', binaryName);
// }


function getBinaryPath() {
  const isWin = process.platform === 'win32';
  const platformDir = isWin ? 'win' : 'mac';
  const binaryName = isWin ? 'proctor_engine.exe' : 'proctor_engine';

  // Resolve from Electron app root
  const binaryPath = path.join(__dirname, './bin', platformDir, binaryName);
  const resolved = path.resolve(binaryPath);

  console.log("🛠️ Resolved binary path:", resolved);

  if (!fs.existsSync(resolved)) {
    throw new Error(`❌ Proctor Engine binary not found at: ${resolved}`);
  }

  return resolved;
}


function launchProctorEngine(userId, examId, eventId) {
  const binaryPath = getBinaryPath();
  proctorProcess = spawn(binaryPath, [userId, examId, eventId], {
    // shell: true,
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
  app.on('open-url', (event, url) => {
    event.preventDefault();
    try {
      console.log('🧠 Protocol triggered:', url);

      const parsedUrl = new URL(url);
      const userId = parsedUrl.searchParams.get('userId');
      const examId = parsedUrl.searchParams.get('examId');
      const eventId = parsedUrl.searchParams.get('eventId');

      if (!userId || !examId || !eventId) {
        console.error('❌ Missing parameters in URL');
        return;
      }

      if (!mainWindow || mainWindow.isDestroyed()) {
        createWindow(userId, examId, eventId);
      } else {
        const loadUrl = `http://localhost:5173/test?userId=${userId}&examId=${examId}&eventId=${eventId}`;
        mainWindow.loadURL(loadUrl);
        mainWindow.show();
        mainWindow.focus();
      }
    } catch (error) {
      console.error('❌ Error parsing URL:', error);
    }
  });

  // Create a dummy window if you want when app starts without protocol (optional)
  // if (process.argv.length >= 2) {
  //   console.log(process.argv);
  //   createWindow(process.argv[2], process.argv[3], process.argv[4]);
  // }
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
