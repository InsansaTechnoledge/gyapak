import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { spawn } from 'child_process';

let mainWindow;
let proctorProcess = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the frontend
//   mainWindow.loadURL('http://localhost:5173'); // Or use loadFile('index.html') for production

     mainWindow.loadURL('http://localhost:5173');
   
    // mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

}

// This function returns path to your OS-specific binary
function getBinaryPath() {
  const baseDir = path.join(__dirname, '..', 'bin');
  const isWindows = process.platform === 'win32';
  return path.join(baseDir, isWindows ? 'win' : 'mac', isWindows ? 'proctor_engine.exe' : 'proctor_engine');
}

app.whenReady().then(createWindow);

// 🟢 Start the proctor engine
ipcMain.on('start-proctor-engine', (event, { userId, examId, eventId }) => {
  if (proctorProcess) {
    mainWindow.webContents.send('proctor-log', '⚠️ Proctor Engine already running.');
    return;
  }

  const binaryPath = getBinaryPath();

  // Spawn the engine process
  proctorProcess = spawn(binaryPath, [userId, examId, eventId]);

  // Handle stdout
  proctorProcess.stdout.on('data', (data) => {
    mainWindow.webContents.send('proctor-log', data.toString());
  });

  // Handle stderr
  proctorProcess.stderr.on('data', (data) => {
    mainWindow.webContents.send('proctor-log', `❌ ERROR: ${data}`);
  });

  // On Exit
  proctorProcess.on('exit', (code) => {
    mainWindow.webContents.send('proctor-log', `🛑 Proctor Engine exited with code ${code}`);
    proctorProcess = null;
  });
});

// 🔴 Stop the engine
ipcMain.on('stop-proctor-engine', () => {
  if (proctorProcess) {
    proctorProcess.kill('SIGINT'); // Graceful shutdown (handled in your C++)
    proctorProcess = null;
  }
});

// 🧹 Clean shutdown
app.on('window-all-closed', () => {
  if (proctorProcess) {
    proctorProcess.kill('SIGTERM');
    proctorProcess = null;
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});
