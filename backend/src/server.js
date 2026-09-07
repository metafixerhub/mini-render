const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mini Render Control API is running' });
});

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const deployRoutes = require('./routes/deploy');
const githubRoutes = require('./routes/github');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/deploy', deployRoutes);
app.use('/api/github', githubRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Control API listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
