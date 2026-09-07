const express = require('express');
const router = express.Router();
require('dotenv').config();

router.get('/github', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = 'http://localhost:4000/api/auth/github/callback';
  
  if (clientId) {
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`;
    res.redirect(githubUrl);
  } else {
    // Mock flow
    console.log('[Auth] Using mock GitHub OAuth flow');
    res.redirect(`${redirectUri}?code=mock_code`);
  }
});

router.get('/github/callback', async (req, res) => {
  const { code } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  if (code === 'mock_code' || !process.env.GITHUB_CLIENT_ID) {
    // Mock successful login
    res.redirect(`${frontendUrl}/dashboard?token=mock_jwt_token_123`);
  } else {
    // Real flow (to be implemented fully when tokens are provided)
    res.redirect(`${frontendUrl}/dashboard?token=real_jwt_token_pending`);
  }
});

module.exports = router;
