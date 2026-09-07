const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const execPromise = util.promisify(exec);

async function buildAndRun(repoUrl, port, deploymentId, envVars = []) {
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

  // 4. Build Env Vars string
  const envString = envVars.map(e => `-e ${e.key}="${e.value}"`).join(' ');

  // 5. Build Traefik Labels (if BASE_DOMAIN is set)
  const baseDomain = process.env.BASE_DOMAIN || 'localhost';
  const traefikLabels = process.env.NODE_ENV === 'production' 
    ? `-l traefik.enable=true -l traefik.http.routers.${imageName}.rule=Host(\`${repoName.toLowerCase()}.${baseDomain}\`) -l traefik.http.services.${imageName}.loadbalancer.server.port=8080 -l traefik.http.routers.${imageName}.tls.certresolver=letsencrypt --network proxy`
    : `-p ${port}:8080`;

  // 6. Docker Run
  console.log(`[Docker Service] Running container`);
  const { stdout: containerId } = await execPromise(`docker run -d ${envString} ${traefikLabels} ${imageName}`);
  
  console.log(`[Docker Service] Container started: ${containerId.trim()}`);
  return containerId.trim();
}

module.exports = {
  buildAndRun
};
