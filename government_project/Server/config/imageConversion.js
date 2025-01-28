import fs from 'fs';
export const convertImageToBase64 = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      const base64Image = data.toString('base64');  // Convert buffer to base64 string
      resolve(base64Image);
    });
  });
};