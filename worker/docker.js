const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const execPromise = util.promisify(exec);

async function buildAndRun(repoUrl, port, deploymentId, envVars = []) {
  const repoName = repoUrl.split('/').pop().replace('.git', '');
  const cloneDir = path.join(__dirname, '../tmp', deploymentId);
  const imageName = `minirender-${repoName.toLowerCase()}-${deploymentId}`.replace(/[^a-z0-9_-]/g, '');

  console.log(`[Worker Docker Service] Cloning ${repoUrl} to ${cloneDir}`);
  
  if (!fs.existsSync(path.join(__dirname, '../tmp'))) {
    fs.mkdirSync(path.join(__dirname, '../tmp'), { recursive: true });
  }
  await execPromise(`git clone ${repoUrl} ${cloneDir}`);

  const dockerfilePath = path.join(cloneDir, 'Dockerfile');
  if (!fs.existsSync(dockerfilePath)) {
    console.log(`[Worker Docker Service] No Dockerfile found. Creating default Node.js Dockerfile.`);
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

  console.log(`[Worker Docker Service] Building image ${imageName}`);
  await execPromise(`docker build -t ${imageName} .`, { cwd: cloneDir });

  const envString = envVars.map(e => `-e ${e.key}="${e.value}"`).join(' ');

  const baseDomain = process.env.BASE_DOMAIN || 'localhost';
  const traefikLabels = process.env.NODE_ENV === 'production' 
    ? `-l traefik.enable=true -l traefik.http.routers.${imageName}.rule=Host(\`${repoName.toLowerCase()}.${baseDomain}\`) -l traefik.http.services.${imageName}.loadbalancer.server.port=8080 -l traefik.http.routers.${imageName}.tls.certresolver=letsencrypt --network proxy`
    : `-p ${port}:8080`;

  console.log(`[Worker Docker Service] Running container`);
  const { stdout: containerId } = await execPromise(`docker run -d ${envString} ${traefikLabels} ${imageName}`);
  
  console.log(`[Worker Docker Service] Container started: ${containerId.trim()}`);
  return containerId.trim();
}

module.exports = {
  buildAndRun
};
