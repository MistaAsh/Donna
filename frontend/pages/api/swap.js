// pages/api/swap.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { chainId, fromTokenAddress, toTokenAddress, amount, address } = req.body;

    try {
      // Perform any processing you need with content and sessionId
      // For example, make another request to a different API
      const result = await axios.get(`http://localhost:3001/quote/?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&walletAddress=${address}&source=sdk`, {
        data: {},
      });

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
