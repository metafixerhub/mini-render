const express = require('express');
const router = express.Router();
const deploymentService = require('../services/deployment');

router.post('/', async (req, res) => {
  const { repoUrl, branch } = req.body;
  if (!repoUrl) {
    return res.status(400).json({ error: 'Repository URL is required' });
  }

  try {
    const deployment = await deploymentService.startDeployment({ repoUrl, branch });
    res.json({ message: 'Deployment triggered', deployment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
