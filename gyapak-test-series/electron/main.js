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
  const { spawn } = require('child_process');
  const path = require('path');
  const fs = require('fs');
  const readline = require('readline');
  const axios = require('axios');

  let mainWindow;
  let proctorProcess = null;
  let isProtocolLaunch = false;

  const [, , cliUserId, cliExamId, cliEventId] = process.argv;

  if (!app.isDefaultProtocolClient('gyapak')) {
    app.setAsDefaultProtocolClient('gyapak');
  }

  function safeSend(channel, data) {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send(channel, data);
    }
  }

  async function waitForViteReady() {
    const maxAttempts = 20;
    let attempts = 0;
    while (attempts < maxAttempts) {
      try {
        await axios.get('http://localhost:5173');
        console.log('✅ Vite Dev Server is ready.');
        return true;
      } catch (err) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    console.error('❌ Vite Dev Server not responding.');
    return false;
  }

  // 🛠 Fixed: Always open localhost:5173 first
  async function createWindow() {
    const preloadPath = path.resolve(__dirname, 'preload.js');

    mainWindow = new BrowserWindow({
      fullscreen: true,
      show: false,
      webPreferences: {
        preload: preloadPath,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        webSecurity: true,
      },
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    mainWindow.on('ready-to-show', () => {
      mainWindow.show();
    });

    const viteReady = await waitForViteReady();
    if (!viteReady) {
      app.quit();
      return;
    }

    console.log('➡️ Loading URL: http://localhost:5173/');
    await mainWindow.loadURL('http://localhost:5173/');
  }

  function navigateToTest(userId, examId, eventId) {
    if (!mainWindow || mainWindow.isDestroyed()) return;

    const hashUrl = `#/test?userId=${userId}&examId=${examId}&eventId=${eventId}`;
    console.log('➡️ Navigating to:', hashUrl);

    mainWindow.webContents.executeJavaScript(`
      window.location.hash = '${hashUrl}';
    `);

    safeSend('user-data', { userId, examId, eventId });
  }

  function getBinaryPath() {
    const platform = process.platform === 'win32' ? 'win' : 'mac';
    const binaryName = platform === 'win' ? 'proctor_engine.exe' : 'proctor_engine';
    const binaryPath = path.join(__dirname, 'bin', platform, binaryName);

    if (!fs.existsSync(binaryPath)) {
      throw new Error(`Proctor Engine binary not found at: ${binaryPath}`);
    }
    return binaryPath;
  }

  function launchProctorEngine(userId, examId, eventId) {
    if (proctorProcess) {
      safeSend('proctor-log', '⚠️ Proctor Engine already running');
      return;
    }

    try {
      const binaryPath = getBinaryPath();
      proctorProcess = spawn(binaryPath, [userId, examId, eventId], {
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
      });

      const rl = readline.createInterface({ input: proctorProcess.stdout });

      rl.on('line', (line) => {
        try {
          const data = JSON.parse(line);
          if (data?.eventType === 'anomaly') {
            safeSend('proctor-warning', data);
          } else {
            safeSend('proctor-log', data);
          }
        } catch {
          safeSend('proctor-log', line);
        }
      });

      proctorProcess.stderr.on('data', (data) => {
        safeSend('proctor-error', data.toString());
      });

      proctorProcess.on('close', (code) => {
        safeSend('proctor-log', `🛑 Proctor Engine exited with code ${code}`);
        proctorProcess = null;
      });

      proctorProcess.on('error', (err) => {
        safeSend('proctor-error', `❌ Proctor Engine failed: ${err.message}`);
        proctorProcess = null;
      });

    } catch (err) {
      safeSend('proctor-error', `❌ Engine initialization failed: ${err.message}`);
    }
  }

  function handleProtocolUrl(url) {
    try {
      const parsedUrl = new URL(url);
      const userId = parsedUrl.searchParams.get('userId');
      const examId = parsedUrl.searchParams.get('examId');
      const eventId = parsedUrl.searchParams.get('eventId');

      if (userId && examId && eventId) {
        isProtocolLaunch = true;

        if (!mainWindow || mainWindow.isDestroyed()) {
          createWindow().then(() => {
            navigateToTest(userId, examId, eventId);
            launchProctorEngine(userId, examId, eventId);
          });
        } else {
          navigateToTest(userId, examId, eventId);
          launchProctorEngine(userId, examId, eventId);
        }
      }
    } catch (err) {
      console.error('Error handling protocol URL:', err);
    }
  }

  function initializeApp() {
    app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
    app.commandLine.appendSwitch('disk-cache-size', '0');
    app.disableHardwareAcceleration();

    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      app.quit();
      return;
    }

    app.on('second-instance', (event, argv) => {
      if (process.platform === 'win32' && argv.length > 1) {
        handleProtocolUrl(argv[1]);
      }

      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
      }
    });

    app.whenReady().then(() => {
      createWindow().then(() => {
        if (cliUserId && cliExamId && cliEventId) {
          navigateToTest(cliUserId, cliExamId, cliEventId);
          launchProctorEngine(cliUserId, cliExamId, cliEventId);
        }
      });

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
        }
      });
    });

    app.on('window-all-closed', () => {
      if (proctorProcess) {
        proctorProcess.kill();
        proctorProcess = null;
      }
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('open-url', (event, url) => {
      event.preventDefault();
      handleProtocolUrl(url);
    });

    ipcMain.on('start-proctor-engine', (event, { userId, examId, eventId }) => {
      navigateToTest(userId, examId, eventId);
      launchProctorEngine(userId, examId, eventId);
    });

    ipcMain.on('stop-proctor-engine', () => {
      if (proctorProcess) {
        proctorProcess.kill('SIGINT');
        proctorProcess = null;
      }
    });

    ipcMain.on('close-electron-window', () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.close();
      }
    });
  }

  initializeApp();
