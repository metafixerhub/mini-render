const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // TODO: Fetch projects from SQLite
  res.json({ projects: [] });
});

router.post('/', (req, res) => {
  const { name, repoUrl } = req.body;
  // TODO: Save project to SQLite
  res.json({ message: 'Project created', project: { id: 1, name, repoUrl } });
});

module.exports = router;
