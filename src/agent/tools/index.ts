import { Octokit } from '@octokit/rest';
import Anthropic from '@anthropic-ai/sdk';

export interface GitHubTool {
  name: string;
  description: string;
  parameters: Anthropic.Tool['input_schema'];
  execute: (params: Record<string, unknown>) => Promise<string>;
}

export class ToolExecutor {
  private tools: Map<string, GitHubTool> = new Map();

  register(tool: GitHubTool) {
    this.tools.set(tool.name, tool);
  }

  async execute(name: string, params: Record<string, unknown>): Promise<string> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }
    return tool.execute(params);
  }
}

export function createGitHubTools(token: string): { tools: GitHubTool[]; executor: ToolExecutor } {
  const octokit = new Octokit({ auth: token });
  const executor = new ToolExecutor();
  
  const tools: GitHubTool[] = [
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
        const { data } = await octokit.issues.get({
          owner: params.owner as string,
          repo: params.repo as string,
          issue_number: params.issue_number as number,
        });
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
        const { data } = await octokit.issues.listForRepo({
          owner: params.owner as string,
          repo: params.repo as string,
          state: params.state as 'open' | 'closed' | 'all' | undefined,
          labels: params.labels as string | undefined,
        });
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
        const { data } = await octokit.pulls.get({
          owner: params.owner as string,
          repo: params.repo as string,
          pull_number: params.pull_number as number,
        });
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
        const { data } = await octokit.pulls.listFiles({
          owner: params.owner as string,
          repo: params.repo as string,
          pull_number: params.pull_number as number,
        });
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
        const { data } = await octokit.issues.createComment({
          owner: params.owner as string,
          repo: params.repo as string,
          issue_number: params.issue_number as number,
          body: params.body as string,
        });
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
        const { data } = await octokit.issues.listMilestones({
          owner: params.owner as string,
          repo: params.repo as string,
          state: params.state as 'open' | 'closed' | 'all' | undefined,
        });
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
          owner: params.owner as string,
          repo: params.repo as string,
          pull_number: params.pull_number as number,
          mediaType: { format: 'diff' },
        });
        return String(response.data);
      },
    },

    {
      name: 'create_issue',
      description: 'Create a new issue in a repository',
      parameters: {
        type: 'object',
        properties: {
          owner: { type: 'string' },
          repo: { type: 'string' },
          title: { type: 'string', description: 'Issue title' },
          body: { type: 'string', description: 'Issue body in markdown' },
          labels: { type: 'array', items: { type: 'string' }, description: 'Labels to apply' },
        },
        required: ['owner', 'repo', 'title'],
      },
      execute: async (params) => {
        const { data } = await octokit.issues.create({
          owner: params.owner as string,
          repo: params.repo as string,
          title: params.title as string,
          body: params.body as string | undefined,
          labels: params.labels as string[] | undefined,
        });
        return JSON.stringify(data, null, 2);
      },
    },

    {
      name: 'get_file_content',
      description: 'Get content of a file in a repository',
      parameters: {
        type: 'object',
        properties: {
          owner: { type: 'string' },
          repo: { type: 'string' },
          path: { type: 'string', description: 'File path' },
          ref: { type: 'string', description: 'Branch or commit ref' },
        },
        required: ['owner', 'repo', 'path'],
      },
      execute: async (params) => {
        const { data } = await octokit.repos.getContent({
          owner: params.owner as string,
          repo: params.repo as string,
          path: params.path as string,
          ref: params.ref as string | undefined,
        });
        
        if ('content' in data && data.content) {
          return Buffer.from(data.content, 'base64').toString('utf-8');
        }
        return JSON.stringify(data, null, 2);
      },
    },

    // ===== 新增：自动创建 PR 的工具 =====
    
    {
      name: 'create_branch',
      description: 'Create a new branch in a repository',
      parameters: {
        type: 'object',
        properties: {
          owner: { type: 'string' },
          repo: { type: 'string' },
          branch: { type: 'string', description: 'New branch name' },
          base_branch: { type: 'string', description: 'Base branch to create from (default: main)' },
        },
        required: ['owner', 'repo', 'branch'],
      },
      execute: async (params) => {
        const owner = params.owner as string;
        const repo = params.repo as string;
        const branch = params.branch as string;
        const baseBranch = (params.base_branch as string) || 'main';
        
        // Get the base branch's latest commit
        const { data: ref } = await octokit.git.getRef({
          owner,
          repo,
          ref: `heads/${baseBranch}`,
        });
        
        // Create new branch
        const { data } = await octokit.git.createRef({
          owner,
          repo,
          ref: `refs/heads/${branch}`,
          sha: ref.object.sha,
        });
        
        return JSON.stringify({ success: true, branch, sha: ref.object.sha }, null, 2);
      },
    },

    {
      name: 'create_or_update_file',
      description: 'Create or update a file in a repository branch',
      parameters: {
        type: 'object',
        properties: {
          owner: { type: 'string' },
          repo: { type: 'string' },
          branch: { type: 'string', description: 'Branch name' },
          path: { type: 'string', description: 'File path' },
          content: { type: 'string', description: 'File content' },
          message: { type: 'string', description: 'Commit message' },
        },
        required: ['owner', 'repo', 'branch', 'path', 'content', 'message'],
      },
      execute: async (params) => {
        const owner = params.owner as string;
        const repo = params.repo as string;
        const branch = params.branch as string;
        const path = params.path as string;
        const content = params.content as string;
        const message = params.message as string;
        
        // Check if file exists
        let sha: string | undefined;
        try {
          const { data: existingFile } = await octokit.repos.getContent({
            owner,
            repo,
            path,
            ref: branch,
          });
          if ('sha' in existingFile) {
            sha = existingFile.sha;
          }
        } catch (e) {
          // File doesn't exist, that's fine
        }
        
        // Create or update file
        const { data } = await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path,
          message,
          content: Buffer.from(content).toString('base64'),
          branch,
          sha,
        });
        
        return JSON.stringify({ success: true, path, commit: data.commit.sha }, null, 2);
      },
    },

    {
      name: 'create_pull_request',
      description: 'Create a pull request',
      parameters: {
        type: 'object',
        properties: {
          owner: { type: 'string' },
          repo: { type: 'string' },
          title: { type: 'string', description: 'PR title' },
          body: { type: 'string', description: 'PR description in markdown' },
          head: { type: 'string', description: 'Branch with changes' },
          base: { type: 'string', description: 'Branch to merge into (default: main)' },
          draft: { type: 'boolean', description: 'Create as draft PR' },
        },
        required: ['owner', 'repo', 'title', 'head'],
      },
      execute: async (params) => {
        const { data } = await octokit.pulls.create({
          owner: params.owner as string,
          repo: params.repo as string,
          title: params.title as string,
          body: params.body as string | undefined,
          head: params.head as string,
          base: (params.base as string) || 'main',
          draft: (params.draft as boolean) || false,
        });
        return JSON.stringify({
          success: true,
          pr_number: data.number,
          url: data.html_url,
        }, null, 2);
      },
    },

    {
      name: 'list_branches',
      description: 'List branches in a repository',
      parameters: {
        type: 'object',
        properties: {
          owner: { type: 'string' },
          repo: { type: 'string' },
        },
        required: ['owner', 'repo'],
      },
      execute: async (params) => {
        const { data } = await octokit.repos.listBranches({
          owner: params.owner as string,
          repo: params.repo as string,
        });
        return JSON.stringify(data.map(b => ({ name: b.name, sha: b.commit.sha })), null, 2);
      },
    },

    {
      name: 'close_issue',
      description: 'Close an issue',
      parameters: {
        type: 'object',
        properties: {
          owner: { type: 'string' },
          repo: { type: 'string' },
          issue_number: { type: 'number' },
          comment: { type: 'string', description: 'Optional closing comment' },
        },
        required: ['owner', 'repo', 'issue_number'],
      },
      execute: async (params) => {
        const owner = params.owner as string;
        const repo = params.repo as string;
        const issue_number = params.issue_number as number;
        const comment = params.comment as string | undefined;
        
        if (comment) {
          await octokit.issues.createComment({ owner, repo, issue_number, body: comment });
        }
        
        const { data } = await octokit.issues.update({
          owner,
          repo,
          issue_number,
          state: 'closed',
        });
        
        return JSON.stringify({ success: true, issue_number, state: data.state }, null, 2);
      },
    },
  ];

  // Register all tools
  tools.forEach(tool => executor.register(tool));

  return { tools, executor };
}
