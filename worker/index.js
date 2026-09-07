require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const dockerService = require('./docker');

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// API Key middleware to secure the worker
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.WORKER_API_KEY}`) {
    return res.status(403).json({ error: 'Unauthorized worker access' });
  }
  next();
});

app.post('/deploy', async (req, res) => {
  const { repoUrl, port, deploymentId, envVars } = req.body;
  if (!repoUrl || !deploymentId) return res.status(400).json({ error: 'Missing parameters' });

  // Acknowledge the request immediately
  res.json({ message: 'Deployment accepted by worker' });

  try {
    // Actually run docker build and run
    const containerId = await dockerService.buildAndRun(repoUrl, port, deploymentId, envVars);
    
    // Update the DB directly from the worker (since worker connects to the same Postgres)
    await prisma.deployment.update({
      where: { id: parseInt(deploymentId.replace('dep_', '')) },
      data: { status: 'LIVE', port, containerId }
    });
    console.log(`[Worker] Deployment ${deploymentId} is LIVE on port ${port} with container ${containerId}`);
  } catch (err) {
    console.error(`[Worker] Deployment ${deploymentId} FAILED:`, err);
    await prisma.deployment.update({
      where: { id: parseInt(deploymentId.replace('dep_', '')) },
      data: { status: 'FAILED' }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Worker listening on port ${PORT}`);
});
