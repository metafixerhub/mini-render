// GitHub integration for Phase 2

async function getRepositories(accessToken) {
  // Mock GitHub API call
  return [
    { id: 1, name: 'hello-world', url: 'https://github.com/mock/hello-world' },
    { id: 2, name: 'nextjs-blog', url: 'https://github.com/mock/nextjs-blog' }
  ];
}

module.exports = {
  getRepositories
};
