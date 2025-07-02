import fs from 'fs';

export function deleteFile(filePath: string): void {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (error) => {
      if (error) console.log(error);
    });
  }
}
