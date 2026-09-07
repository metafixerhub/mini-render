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

// Phase 4: GitHub Webhook to auto-deploy
const deploymentService = require('../services/deployment');

router.post('/webhooks', async (req, res) => {
  // When GitHub pings this URL on push, we auto deploy
  const { repository, ref } = req.body;
  if (!repository || !repository.clone_url) {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  // Find if we track this project
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  const project = await prisma.project.findFirst({ where: { repoUrl: repository.clone_url } });
  
  if (project) {
    console.log(`[Webhook] Auto-deploy triggered for ${project.name}`);
    deploymentService.startDeployment({ repoUrl: repository.clone_url, branch: 'main' });
    return res.status(202).json({ message: 'Deployment triggered' });
  } else {
    return res.status(404).json({ message: 'Project not tracked' });
  }
});

module.exports = router;
