// // import { spawn } from 'child_process';
// // import path from 'path';
// // import { fileURLToPath } from 'url';
// // import { existsSync } from 'fs';

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // export const launchProctor = (req, res) => {
// //   try {
// //     const { userId, examId, eventId } = req.body;

// //     if (!userId || !examId || !eventId) {
// //       return res.status(400).json({ message: "Missing required fields" });
// //     }

// //     const electronMainPath = path.resolve(__dirname, '../../../gyapak-test-series/electron/main.js');

// //     // Use local electron binary
// //     const localElectronBinary = path.resolve(__dirname, '../../../gyapak-test-series/node_modules/.bin/electron');

// //     if (!existsSync(localElectronBinary)) {
// //       return res.status(500).json({ message: 'Electron binary not found. Please run `npm install electron`.' });
// //     }

// //     const child = spawn(`"${localElectronBinary}"`, [`"${electronMainPath}"`, userId, examId, eventId], {
// //       detached: true,
// //       stdio: 'inherit',
// //       shell: true
// //     });

// //     child.unref(); // allow the process to continue running

// //     return res.status(200).json({ message: '✅ Proctoring started' });
// //   } catch (error) {
// //     console.error('❌ Failed to launch proctor:', error);
// //     return res.status(500).json({ message: 'Failed to launch proctor' });
// //   }
// // };


// import { spawn } from 'child_process';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { existsSync } from 'fs';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const launchProctor = (req, res) => {
//   try {
//     const { userId, examId, eventId } = req.body;
//     if (!userId || !examId || !eventId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const electronMainPath = path.resolve(__dirname, '../../../gyapak-test-series/electron/main.js');
//     const localElectronBinary = path.resolve(__dirname, '../../../gyapak-test-series/node_modules/.bin/electron');

//     // Check if proctor binary exists
//     const isInstalled = existsSync(localElectronBinary) && existsSync(electronMainPath);

//     // If not installed, signal frontend to download
//     if (!isInstalled) {
//       return res.status(200).json({ 
//         downloadRequired: true, 
//         message: "Electron Proctoring App not installed. Prompting download." 
//       });
//     }

//     // Start the proctor engine if installed
//     const child = spawn(`"${localElectronBinary}"`, [`"${electronMainPath}"`, userId, examId, eventId], {
//       detached: true,
//       stdio: 'inherit',
//       shell: true
//     });

//     child.unref();

//     return res.status(200).json({ 
//       message: '✅ Proctoring started',
//       downloadRequired: false
//     });
    
//   } catch (error) {
//     console.error('❌ Failed to launch proctor:', error);
//     return res.status(500).json({ message: 'Failed to launch proctor' });
//   }
// };


import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const launchProctor = (req, res) => {
  try {
    const { userId, examId, eventId } = req.body;
    if (!userId || !examId || !eventId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const electronMainPath = path.resolve(__dirname, '../../../gyapak-test-series/electron/main.js');
    const localElectronBinary = path.resolve(__dirname, '../../../gyapak-test-series/node_modules/.bin/electron');

    const isInstalled = existsSync(localElectronBinary) && existsSync(electronMainPath);

    if (!isInstalled) {
      return res.status(200).json({ 
        downloadRequired: true, 
        message: "Electron Proctoring App not installed. Prompting download." 
      });
    }

    // ✅ Capture stdout and stderr manually
    const child = spawn(localElectronBinary, [electronMainPath, userId, examId, eventId], {
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'], // ✅ Only pipe stdout/stderr
      shell: false, // ✅ No shell needed
    });

    // ✅ Pipe Electron stdout
    child.stdout.on('data', (data) => {
      console.log(`🔵 [Electron]: ${data.toString().trim()}`);
    });

    // ✅ Pipe Electron stderr
    child.stderr.on('data', (data) => {
      console.error(`🔴 [Electron Error]: ${data.toString().trim()}`);
    });

    child.on('close', (code) => {
      console.log(`🛑 [Electron closed with code ${code}]`);
    });

    child.unref(); // Let child run independently

    return res.status(200).json({ 
      message: '✅ Proctoring started',
      downloadRequired: false
    });

  } catch (error) {
    console.error('❌ Failed to launch proctor:', error);
    return res.status(500).json({ message: 'Failed to launch proctor' });
  }
};
