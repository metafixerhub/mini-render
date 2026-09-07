const express = require('express');
const router = express.Router();
const githubService = require('../services/github');

router.get('/repos', async (req, res) => {
  // In Phase 2: Use actual user token
  try {
    const repos = await githubService.getRepositories('mock_token');
    res.json({ repos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
