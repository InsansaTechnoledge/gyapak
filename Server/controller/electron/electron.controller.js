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

    const child = spawn(localElectronBinary, [electronMainPath, userId, examId, eventId], {
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    });

    child.stdout.on('data', (data) => {
      console.log(`🔵 [Electron stdout]: ${data.toString().trim()}`);
    });

    child.stderr.on('data', (data) => {
      console.error(`🔴 [Electron stderr]: ${data.toString().trim()}`);
    });

    child.on('close', (code) => {
      console.log(`🛑 [Electron closed with code ${code}]`);
    });

    child.unref(); // Detach properly so frontend continues

    return res.status(200).json({ 
      message: '✅ Proctoring started',
      downloadRequired: false
    });

  } catch (error) {
    console.error('❌ Failed to launch proctor:', error);
    return res.status(500).json({ message: 'Failed to launch proctor' });
  }
};
