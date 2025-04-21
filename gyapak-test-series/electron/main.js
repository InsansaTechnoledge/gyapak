import { app, BrowserWindow, ipcMain } from 'electron';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;
let proctorProcess = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // ✅ Make sure preload.js is here
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL('http://localhost:5173/test');
}

// OS-specific binary path
function getBinaryPath() {
  const baseDir = path.join(__dirname, '..', 'bin');
  const isWindows = process.platform === 'win32';
  return path.join(baseDir, isWindows ? 'win' : 'mac', isWindows ? 'proctor_engine.exe' : 'proctor_engine');
}

app.whenReady().then(createWindow);

// Start proctor engine
ipcMain.on('start-proctor-engine', (event, { userId, examId, eventId }) => {
  if (proctorProcess) {
    mainWindow.webContents.send('proctor-log', '⚠️ Proctor Engine already running.');
    return;
  }

  const binaryPath = getBinaryPath();
  proctorProcess = spawn(binaryPath, [userId, examId, eventId]);

  proctorProcess.stdout.on('data', (data) => {
    mainWindow.webContents.send('proctor-log', data.toString());
  });

  proctorProcess.stderr.on('data', (data) => {
    mainWindow.webContents.send('proctor-log', `❌ ERROR: ${data}`);
  });

  proctorProcess.on('exit', (code) => {
    mainWindow.webContents.send('proctor-log', `🛑 Proctor Engine exited with code ${code}`);
    proctorProcess = null;
  });
});

// Stop engine
ipcMain.on('stop-proctor-engine', () => {
  if (proctorProcess) {
    proctorProcess.kill('SIGINT');
    proctorProcess = null;
  }
});


// Handle window close
app.on('window-all-closed', () => {
  if (proctorProcess) {
    proctorProcess.kill('SIGTERM');
    proctorProcess = null;
  }
  if (process.platform !== 'darwin') app.quit();
});
