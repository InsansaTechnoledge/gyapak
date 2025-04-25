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

    // Use local electron binary
    const localElectronBinary = path.resolve(__dirname, '../../../gyapak-test-series/node_modules/.bin/electron');
    if (!existsSync(localElectronBinary)) {
      return res.status(500).json({ message: 'Electron binary not found. Please run `npm install electron`.' });
    }

    const child = spawn(`"${localElectronBinary}"`, [`"${electronMainPath}"`, userId, examId, eventId], {
      detached: true,
      stdio: 'inherit',
      shell: true
    });


    child.unref(); // allow the process to continue running

    return res.status(200).json({ message: '✅ Proctoring started' });
  } catch (error) {
    console.error('❌ Failed to launch proctor:', error);
    return res.status(500).json({ message: 'Failed to launch proctor' });
  }
};
