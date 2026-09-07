const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        deployments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        deployments: { orderBy: { createdAt: 'desc' } },
        envVars: true
      }
    });
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/env', async (req, res) => {
  try {
    const { key, value } = req.body;
    const envVar = await prisma.envVar.create({
      data: {
        key,
        value,
        projectId: parseInt(req.params.id)
      }
    });
    res.json({ envVar });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
