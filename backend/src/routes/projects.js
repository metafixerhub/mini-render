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

module.exports = router;
