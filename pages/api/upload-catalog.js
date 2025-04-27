import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filename = file.name;

  const { data, error } = await supabase
    .storage
    .from(process.env.SUPABASE_BUCKET)
    .upload(filename, file.stream(), {
      contentType: file.type
    });

  if (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Upload failed' });
  }

  return res.status(200).json({ message: 'File uploaded successfully!', path: data.path });
}
