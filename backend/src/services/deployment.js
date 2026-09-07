// Service to interact with Docker Engine
const dockerService = require('./docker');

async function startDeployment({ repoUrl, branch }) {
  console.log(`[Deployment Service] Preparing to deploy ${repoUrl}`);
  
  const deploymentId = `dep_${Math.random().toString(36).substr(2, 9)}`;
  const port = Math.floor(Math.random() * (9000 - 8000 + 1) + 8000); // Random port for V1 mock

  // Phase 3: Docker integration
  // await dockerService.buildAndRun(repoUrl, port);
  
  return {
    id: deploymentId,
    status: 'BUILDING', // will move to LIVE
    port,
    repoUrl
  };
}

module.exports = {
  startDeployment
};
