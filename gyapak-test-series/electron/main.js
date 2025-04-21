import { app, BrowserWindow, ipcMain } from 'electron';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const binDir = path.join(__dirname, '..', 'bin');
  return path.join(binDir, process.platform === 'win32' ? 'win/proctor_engine.exe' : 'mac/proctor_engine');
}

function launchProctorEngine() {
  const binaryPath = getBinaryPath();
  proctorProcess = spawn(binaryPath, [userId, examId, eventId]);

  proctorProcess.stdout.on('data', (data) => {
    mainWindow?.webContents.send('proctor-log', data.toString());
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
  launchProctorEngine();
});

ipcMain.on('stop-proctor-engine', () => {
  if (proctorProcess) {
    proctorProcess.kill('SIGINT');
    proctorProcess = null;
  }
});

app.on('window-all-closed', () => {
  if (proctorProcess) {
    proctorProcess.kill('SIGTERM');
    proctorProcess = null;
  }
  if (process.platform !== 'darwin') app.quit();
});
