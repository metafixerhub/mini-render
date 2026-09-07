// Service to interact with Docker Engine
const dockerService = require('./docker');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function startDeployment({ repoUrl, branch }) {
  console.log(`[Deployment Service] Preparing to deploy ${repoUrl}`);
  
  // 1. Find or create Project
  let project = await prisma.project.findFirst({ where: { repoUrl } });
  if (!project) {
    const name = repoUrl.split('/').pop().replace('.git', '');
    project = await prisma.project.create({
      data: { name, repoUrl }
    });
  }

  // 2. Create Deployment record
  let deployment = await prisma.deployment.create({
    data: {
      projectId: project.id,
      status: 'BUILDING'
    }
  });

  const port = Math.floor(Math.random() * (9000 - 8000 + 1) + 8000); // Random port for V1 mock
  
  // Fetch Env Vars
  const envVars = await prisma.envVar.findMany({ where: { projectId: project.id } });

  // 3. Execute Docker Build and Run asynchronously
  // In a real app, this would be a separate worker, but for V1 we do it here.
  dockerService.buildAndRun(repoUrl, port, `dep_${deployment.id}`, envVars).then(async (containerId) => {
    await prisma.deployment.update({
      where: { id: deployment.id },
      data: { status: 'LIVE', port, containerId }
    });
    console.log(`[Deployment Service] Deployment ${deployment.id} is LIVE on port ${port} with container ${containerId}`);
  }).catch(async (err) => {
    console.error(`[Deployment Service] Deployment ${deployment.id} FAILED:`, err);
    await prisma.deployment.update({
      where: { id: deployment.id },
      data: { status: 'FAILED' }
    });
  });
  
  return deployment;
}

module.exports = {
  startDeployment
};
