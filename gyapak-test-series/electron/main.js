import { app, BrowserWindow, ipcMain } from 'electron';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let proctorProcess = null;

// ✅ Parse CLI args passed from backend
const [, , userId, examId, eventId] = process.argv;

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

  // ✅ Load the specific test page with user params
  const url = `http://localhost:5173/test?userId=${userId}&examId=${examId}&eventId=${eventId}`;
  mainWindow.loadURL(url);

  // 🔒 Optional: disable dev tools
  // mainWindow.webContents.on('did-finish-load', () => {
  //   mainWindow.webContents.closeDevTools();
  // });
}

// ✅ Get binary path based on OS
function getBinaryPath() {
  const binDir = path.join(__dirname, '..', 'bin');
  const isWindows = process.platform === 'win32';
  return path.join(binDir, isWindows ? 'win/proctor_engine.exe' : 'mac/proctor_engine');
}

// ✅ Run engine after window is ready
function launchProctorEngine() {
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

  proctorProcess.on('error', (err) => {
    mainWindow.webContents.send('proctor-log', `❌ Failed to start engine: ${err.message}`);
    proctorProcess = null;
  });
}

// ✅ Stop engine on IPC signal
ipcMain.on('stop-proctor-engine', () => {
  if (proctorProcess) {
    proctorProcess.kill('SIGINT');
    proctorProcess = null;
  }
});

// ✅ Lifecycle
app.whenReady().then(() => {
  createWindow();
  launchProctorEngine();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (proctorProcess) {
    proctorProcess.kill('SIGTERM');
    proctorProcess = null;
  }
  if (process.platform !== 'darwin') app.quit();
});
