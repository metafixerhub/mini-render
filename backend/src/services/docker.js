const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const execPromise = util.promisify(exec);

async function buildAndRun(repoUrl, port, deploymentId) {
  const repoName = repoUrl.split('/').pop().replace('.git', '');
  const cloneDir = path.join(__dirname, '../../tmp', deploymentId);
  const imageName = `minirender-${repoName.toLowerCase()}-${deploymentId}`.replace(/[^a-z0-9_-]/g, '');

  console.log(`[Docker Service] Cloning ${repoUrl} to ${cloneDir}`);
  
  // 1. Create tmp dir and clone
  if (!fs.existsSync(path.join(__dirname, '../../tmp'))) {
    fs.mkdirSync(path.join(__dirname, '../../tmp'), { recursive: true });
  }
  await execPromise(`git clone ${repoUrl} ${cloneDir}`);

  // 2. Check for Dockerfile, if not exists, create a default Node.js one
  const dockerfilePath = path.join(cloneDir, 'Dockerfile');
  if (!fs.existsSync(dockerfilePath)) {
    console.log(`[Docker Service] No Dockerfile found. Creating default Node.js Dockerfile.`);
    const defaultDockerfile = `
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
    `;
    fs.writeFileSync(dockerfilePath, defaultDockerfile.trim());
  }

  // 3. Docker Build
  console.log(`[Docker Service] Building image ${imageName}`);
  await execPromise(`docker build -t ${imageName} .`, { cwd: cloneDir });

  // 4. Docker Run (assuming the app exposes 8080 inside the container)
  console.log(`[Docker Service] Running container on port ${port}`);
  const { stdout: containerId } = await execPromise(`docker run -d -p ${port}:8080 ${imageName}`);
  
  console.log(`[Docker Service] Container started: ${containerId.trim()}`);
  return containerId.trim();
}

module.exports = {
  buildAndRun
};
