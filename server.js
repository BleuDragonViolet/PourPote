const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'data', 'messages.json');

function readMessages() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeMessages(msgs) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(msgs, null, 2), 'utf8');
}

// API: récupère messages
app.get('/api/messages', (req, res) => {
  const msgs = readMessages();
  res.json(msgs);
});

// API: ajoute message (anonyme)
app.post('/api/messages', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Message vide' });
  }
  const msgs = readMessages();
  const newMsg = {
    id: Date.now(),
    text: text.trim().slice(0, 1000),
    createdAt: new Date().toISOString()
  };
  msgs.unshift(newMsg); // newest first
  writeMessages(msgs);
  res.json(newMsg);
});

// fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
