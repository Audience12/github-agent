import { Agent } from '@mariozechner/pi-agent-core';
import { createGitHubTools } from './tools/index.js';
import { systemPrompt } from './prompts/index.js';

export interface GitHubAgentConfig {
  githubToken: string;
  llmProvider: 'openai' | 'anthropic' | 'google' | 'zhipu';
  llmApiKey: string;
  llmBaseUrl?: string;
}

export class GitHubAgent {
  private agent: Agent;
  private config: GitHubAgentConfig;

  constructor(config: GitHubAgentConfig) {
    this.config = config;
    this.agent = new Agent({
      name: 'github-intelligent-agent',
      systemPrompt,
      tools: createGitHubTools(config.githubToken),
      llm: {
        provider: config.llmProvider,
        apiKey: config.llmApiKey,
        baseUrl: config.llmBaseUrl,
      },
    });
  }

  async analyzeIssue(owner: string, repo: string, issueNumber: number) {
    const result = await this.agent.run(
      `Analyze issue #${issueNumber} in ${owner}/${repo}. ` +
      `Generate an OpenSpec proposal for implementing the solution.`
    );
    return result;
  }

  async reviewPR(owner: string, repo: string, prNumber: number) {
    const result = await this.agent.run(
      `Review PR #${prNumber} in ${owner}/${repo}. ` +
      `Check if it follows OpenSpec requirements. Report any issues.`
    );
    return result;
  }

  async planMilestone(owner: string, repo: string, milestoneId: number) {
    const result = await this.agent.run(
      `Plan milestone #${milestoneId} in ${owner}/${repo}. ` +
      `Create OpenSpec specs for all linked issues.`
    );
    return result;
  }

  async chat(message: string) {
    return this.agent.run(message);
  }
}

export default GitHubAgent;
