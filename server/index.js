import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // for unique message IDs

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory session store
let sessions = {}; // { sessionId: { title, messages: [] } }

// Create a new session
app.post('/api/sessions', (req, res) => {
  const sessionId = Date.now().toString();
  sessions[sessionId] = {
    title: `Chat ${new Date().toLocaleString()}`,
    messages: []
  };
  res.json({ sessionId });
});

// Get all sessions
app.get('/api/sessions', (req, res) => {
  const sessionList = Object.entries(sessions).map(([id, session]) => ({
    id,
    title: session.title,
    messages: session.messages
  }));
  res.json(sessionList);
});

// Get a single session
app.get('/api/sessions/:sessionId', (req, res) => {
  const session = sessions[req.params.sessionId];
  if (!session) return res.status(404).json({ error: 'Session not found' });

  res.json({
    id: req.params.sessionId,
    title: session.title,
    messages: session.messages
  });
});

// Delete a session
app.delete('/api/sessions/:sessionId', (req, res) => {
  delete sessions[req.params.sessionId];
  res.sendStatus(204);
});

// Check Ollama status
app.get('/api/status', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:11434/api/tags');
    res.json({ status: 'connected', models: response.data.models });
  } catch (err) {
    res.status(500).json({ status: 'disconnected', error: err.message });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { sessionId, message, model = 'llama3.2:3b' } = req.body;

  const session = sessions[sessionId];
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  try {
    // Save user message
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: message
    };
    session.messages.push(userMessage);

    // Call Ollama
    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model,
        prompt: message,
        stream: false
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const reply = response.data.response?.trim();
    const aiMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: reply
    };

    session.messages.push(aiMessage);

    res.json(aiMessage);
  } catch (err) {
    console.error('Ollama error:', err.message);
    res.status(500).json({ error: 'Failed to get response from Ollama' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
