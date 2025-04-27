// pages/api/test.js

export default function handler(req, res) {
  if (req.method === 'POST') {
    return res.status(200).json({ message: '✅ Server is alive and working!' });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
