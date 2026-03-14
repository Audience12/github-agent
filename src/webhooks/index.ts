import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { GitHubAgent } from '../agent/index.js';

const webhookApp = express();
webhookApp.use(express.raw({ type: 'application/json' }));

let agent: GitHubAgent;
let webhookSecret: string;

export function createWebhookHandler(githubAgent: GitHubAgent, secret: string) {
  agent = githubAgent;
  webhookSecret = secret;

  webhookApp.post('/webhook/github', async (req: Request, res: Response) => {
    // Verify signature
    const signature = req.headers['x-hub-signature-256'] as string;
    if (!verifySignature(req.body, signature)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.headers['x-github-event'] as string;
    const payload = JSON.parse(req.body.toString());

    try {
      await handleEvent(event, payload);
      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: String(error) });
    }
  });

  return webhookApp;
}

function verifySignature(payload: Buffer, signature: string): boolean {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

async function handleEvent(event: string, payload: any) {
  const { repository, action } = payload;

  switch (event) {
    case 'issues':
      await handleIssueEvent(action, payload, repository);
      break;

    case 'pull_request':
      await handlePREvent(action, payload, repository);
      break;

    case 'milestone':
      await handleMilestoneEvent(action, payload, repository);
      break;

    default:
      console.log(`Unhandled event: ${event}`);
  }
}

async function handleIssueEvent(action: string, payload: any, repo: any) {
  const issue = payload.issue;

  if (action === 'opened' || action === 'labeled') {
    // Auto-analyze new issues
    if (issue.labels.some((l: any) => l.name === 'needs-analysis')) {
      await agent.analyzeIssue(repo.owner.login, repo.name, issue.number);
    }
  }
}

async function handlePREvent(action: string, payload: any, repo: any) {
  const pr = payload.pull_request;

  if (action === 'opened' || action === 'synchronize') {
    // Auto-review PRs
    await agent.reviewPR(repo.owner.login, repo.name, pr.number);
  }
}

async function handleMilestoneEvent(action: string, payload: any, repo: any) {
  const milestone = payload.milestone;

  if (action === 'created') {
    // Plan new milestones
    await agent.planMilestone(repo.owner.login, repo.name, milestone.number);
  }
}

export { webhookApp };
