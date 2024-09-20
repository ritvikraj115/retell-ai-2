// server.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS middleware
const app = express();
const port = process.env.PORT || 5000;
const Retell = require('retell-sdk')

// Use CORS middleware
app.use(cors({
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use(bodyParser.json());



// Endpoint to create a web call and return the access token
app.post('/api/create-web-call', async (req, res) => {
  const { agentId, apiKey } = await req.body;
  const client = await new Retell({
    apiKey: apiKey, // Replace with your actual API key
  });

  try {
    const webCallResponse = await client.call.createWebCall({
        agent_id: agentId
      });
    res.json({accessToken:webCallResponse.access_token})
      }
   catch (error) {
    console.error('Error creating web call:', error);
    res.status(500).json({ error: 'Failed to create web call' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
