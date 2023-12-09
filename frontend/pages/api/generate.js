// pages/api/generate.js
import axios from 'axios';

export default async function handler(req, res) {

  
  if (req.method === 'POST') {
    const { content, sessionId } = req.body;
    
    try {
      // Perform any processing you need with content and sessionId
      // For example, make another request to a different API
      const result = await axios.get('http://127.0.0.1:5000/generate', {
        data: {
          content,
          session_id: sessionId,
        },
      });
      console.log('2result', result);
      // Respond with the result or any other data
      res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
