import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = new IncomingForm({ multiples: false });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Upload failed' });
    }

    const file = files.file;
    const tempPath = file.filepath;
    const uploadDir = path.join(process.cwd(), '/uploads');

    // Ensure uploads folder exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const newPath = path.join(uploadDir, file.originalFilename);

    // Move the uploaded file
    fs.rename(tempPath, newPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Saving file failed' });
      }

      console.log('File uploaded successfully:', newPath);
      res.status(200).json({ message: 'File uploaded successfully!' });
    });
  });
}
