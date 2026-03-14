import { Octokit } from '@octokit/rest';
import { Tool } from '@mariozechner/pi-agent-core';

export function createGitHubTools(token: string): Tool[] {
  const octokit = new Octokit({ auth: token });

  return [
    {
      name: 'get_issue',
      description: 'Get issue details from GitHub repository',
      parameters: {
        type: 'object',
        properties: {
          owner: { type: 'string', description: 'Repository owner' },
          repo: { type: 'string', description: 'Repository name' },
          issue_number: { type: 'number', description: 'Issue number' },
        },
        required: ['owner', 'repo', 'issue_number'],
      },
      execute: async (params) => {
        const { data } = await octokit.issues.get(params);
        return JSON.stringify(data, null, 2);
      },
    },

    {
      name: 'list_issues',
      description: 'List issues in a GitHub repository',
      parameters: {
        type: 'object',
        properties: {
          owner: { type: 'string' },
          repo: { type: 'string' },
          state: { type: 'string', enum: ['open', 'closed', 'all'] },
          labels: { type: 'string', description: 'Comma-separated labels' },
        },
        required: ['owner', 'repo'],
      },
      execute: async (params) => {
        const { data } = await octokit.issues.listForRepo(params);
        return JSON.stringify(data, null, 2);
      },
    },

    {
      name: 'get_pr',
      description: 'Get pull request details',
      parameters: {
        type: 'object',
        properties: {
          owner: { type: 'string' },
          repo: { type: 'string' },
          pull_number: { type: 'number' },
        },
        required: ['owner', 'repo', 'pull_number'],
      },
      execute: async (params) => {
        const { data } = await octokit.pulls.get(params);
        return JSON.stringify(data, null, 2);
      },
    },

    {
      name: 'review_pr_files',
      description: 'Get files changed in a PR',
      parameters: {
        type: 'object',
        properties: {
          owner: { type: 'string' },
          repo: { type: 'string' },
          pull_number: { type: 'number' },
        },
        required: ['owner', 'repo', 'pull_number'],
      },
      execute: async (params) => {
        const { data } = await octokit.pulls.listFiles(params);
        return JSON.stringify(data, null, 2);
      },
    },

    {
      name: 'create_comment',
      description: 'Create a comment on an issue or PR',
      parameters: {
        type: 'object',
        properties: {
          owner: { type: 'string' },
          repo: { type: 'string' },
          issue_number: { type: 'number' },
          body: { type: 'string', description: 'Comment body in markdown' },
        },
        required: ['owner', 'repo', 'issue_number', 'body'],
      },
      execute: async (params) => {
        const { data } = await octokit.issues.createComment(params);
        return JSON.stringify(data, null, 2);
      },
    },

    {
      name: 'list_milestones',
      description: 'List milestones in a repository',
      parameters: {
        type: 'object',
        properties: {
          owner: { type: 'string' },
          repo: { type: 'string' },
          state: { type: 'string', enum: ['open', 'closed', 'all'] },
        },
        required: ['owner', 'repo'],
      },
      execute: async (params) => {
        const { data } = await octokit.issues.listMilestones(params);
        return JSON.stringify(data, null, 2);
      },
    },

    {
      name: 'get_pr_diff',
      description: 'Get the diff of a pull request',
      parameters: {
        type: 'object',
        properties: {
          owner: { type: 'string' },
          repo: { type: 'string' },
          pull_number: { type: 'number' },
        },
        required: ['owner', 'repo', 'pull_number'],
      },
      execute: async (params) => {
        const response = await octokit.pulls.get({
          ...params,
          mediaType: { format: 'diff' },
        });
        return response.data as string;
      },
    },
  ];
}

export { createGitHubTools };
