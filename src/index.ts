import 'dotenv/config';
import { GitHubAgent } from './agent/index.js';
import { createAPIServer } from './api/index.js';
import { createWebhookHandler } from './webhooks/index.js';

const PORT = process.env.PORT || 3000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const LLM_API_KEY = process.env.LLM_API_KEY || '';
const LLM_PROVIDER = (process.env.LLM_PROVIDER || 'zhipu') as 'openai' | 'anthropic' | 'google' | 'zhipu';
const LLM_BASE_URL = process.env.LLM_BASE_URL;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret';

async function main() {
  // Initialize agent
  const agent = new GitHubAgent({
    githubToken: GITHUB_TOKEN,
    llmProvider: LLM_PROVIDER,
    llmApiKey: LLM_API_KEY,
    llmBaseUrl: LLM_BASE_URL,
  });

  // Create API server
  const apiServer = createAPIServer(agent);
  
  // Create webhook handler
  const webhookHandler = createWebhookHandler(agent, WEBHOOK_SECRET);

  // Mount both
  apiServer.use(webhookHandler);

  // Start server
  apiServer.listen(PORT, () => {
    console.log(`🚀 GitHub Intelligent Agent running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`🔗 Webhook: http://localhost:${PORT}/webhook/github`);
  });
}

main().catch(console.error);
