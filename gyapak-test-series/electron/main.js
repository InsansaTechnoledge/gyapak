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
 
  let url;
  if (userId && examId && eventId) {
    url = `https://gyapak-test-series.vercel.app/test?userId=${userId}&examId=${examId}&eventId=${eventId}`;
  } else {
    url = `https://gyapak-test-series.vercel.app/`; // 👉 Show landing page, or a "waiting" screen
  }
 
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
 
  // Determine base directory safely outside the asar
  let basePath = path.join(process.resourcesPath, 'bin', platformDir);
 
  const fullPath = path.join(basePath, binaryName);
 
  console.log("🛠️ Resolved binary path:", fullPath);
 
  if (!fs.existsSync(fullPath)) {
    throw new Error(`❌ Proctor Engine binary not found at: ${fullPath}`);
  }
 
  return fullPath;
}
 
 
function launchProctorEngine(userId, examId, eventId) {
  const binaryPath = getBinaryPath();
  console.log(binaryPath);
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
  
let pendingOpenUrl = null;
 
function checkPendingProtocol() {
    if (process.platform === 'win32') {
      // On Windows, protocol URL comes in process.argv
      const urlArg = process.argv.find(arg => arg.startsWith('gyapak://'));
      if (urlArg) {
        console.log('🔵 Windows protocol detected:', urlArg);
        pendingOpenUrl = urlArg;
      }
    }
  }
 
app.setAsDefaultProtocolClient('gyapak');
 
checkPendingProtocol();
 
app.whenReady().then(() => {
  if (pendingOpenUrl) {
    // If there was a pending protocol launch during startup
    handleOpenUrl(pendingOpenUrl);
    pendingOpenUrl = null;
  }
 
  app.on('open-url', (event, url) => {
    event.preventDefault();
    handleOpenUrl(url);
  });
});
 
function handleOpenUrl(url) {
  console.log('Protocol triggered:', url);
 
  try {
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
      const loadUrl = `https://gyapak-test-series.vercel.app/test?userId=${userId}&examId=${examId}&eventId=${eventId}`;
      mainWindow.loadURL(loadUrl);
      mainWindow.show();
      mainWindow.focus();
    }
  } catch (error) {
    console.error('❌ Error parsing URL:', error);
  }
}
 
// IMPORTANT:
// macOS: If the app is not running, "open-url" triggers AFTER ready
app.on('second-instance', (event, argv) => {
  // Windows specific: sometimes custom URL comes in argv array
  if (process.platform === 'win32') {
    const url = argv.find(arg => arg.startsWith('gyapak://'));
    if (url) {
      if (app.isReady()) {
        handleOpenUrl(url);
      } else {
        pendingOpenUrl = url;
      }
    }
  }
});
 
// macOS hack:
app.on('open-url', (event, url) => {
  if (app.isReady()) {
    handleOpenUrl(url);
  } else {
    pendingOpenUrl = url;
  }
});
 
 
 
ipcMain.on('start-proctor-engine', (_event, { userId, examId, eventId }) => {
  if (proctorProcess) {
    safeSend('proctor-log', '⚠️ Proctor Engine already running.');
    return;
  }
 
  const testPageUrl = `https://gyapak-test-series.vercel.app/test-page?userId=${userId}&examId=${examId}&eventId=${eventId}`;
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
  app.quit();
});