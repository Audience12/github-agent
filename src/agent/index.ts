import Anthropic from '@anthropic-ai/sdk';
import { createGitHubTools, GitHubTool, ToolExecutor } from './tools/index.js';
import { systemPrompt } from './prompts/index.js';

export interface GitHubAgentConfig {
  githubToken: string;
  llmProvider: 'openai' | 'anthropic' | 'google' | 'zhipu';
  llmApiKey: string;
  llmBaseUrl?: string;
}

export class GitHubAgent {
  private client: Anthropic;
  private tools: GitHubTool[];
  private toolExecutor: ToolExecutor;
  private config: GitHubAgentConfig;
  private conversationHistory: Anthropic.MessageParam[] = [];

  constructor(config: GitHubAgentConfig) {
    this.config = config;
    this.client = new Anthropic({
      apiKey: config.llmApiKey,
      baseURL: config.llmBaseUrl || 'https://api.anthropic.com',
    });
    
    const { tools, executor } = createGitHubTools(config.githubToken);
    this.tools = tools;
    this.toolExecutor = executor;
  }

  async analyzeIssue(owner: string, repo: string, issueNumber: number) {
    return this.chat(
      `Analyze issue #${issueNumber} in ${owner}/${repo}. ` +
      `Generate an OpenSpec proposal for implementing the solution.`
    );
  }

  async reviewPR(owner: string, repo: string, prNumber: number) {
    return this.chat(
      `Review PR #${prNumber} in ${owner}/${repo}. ` +
      `Check if it follows OpenSpec requirements. Report any issues.`
    );
  }

  async planMilestone(owner: string, repo: string, milestoneId: number) {
    return this.chat(
      `Plan milestone #${milestoneId} in ${owner}/${repo}. ` +
      `Create OpenSpec specs for all linked issues.`
    );
  }

  async chat(message: string): Promise<string> {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: message,
    });

    let response = await this.runAgentLoop();
    
    // Add assistant response to history
    this.conversationHistory.push({
      role: 'assistant',
      content: response,
    });

    return response;
  }

  private async runAgentLoop(): Promise<string> {
    let currentMessage: Anthropic.MessageParam[] = [...this.conversationHistory];
    
    while (true) {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: systemPrompt,
        messages: currentMessage,
        tools: this.tools.map(t => ({
          name: t.name,
          description: t.description,
          input_schema: t.parameters,
        })),
      });

      // Check if we have tool calls
      const toolUseBlocks = response.content.filter(
        (block): block is Anthropic.ContentBlock & { type: 'tool_use' } => 
          block.type === 'tool_use'
      );

      if (toolUseBlocks.length === 0) {
        // No tool calls, return text response
        const textBlocks = response.content.filter(
          (block): block is Anthropic.ContentBlock & { type: 'text' } =>
            block.type === 'text'
        );
        return textBlocks.map(b => b.text).join('\n');
      }

      // Process tool calls
      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      
      for (const toolUse of toolUseBlocks) {
        try {
          const result = await this.toolExecutor.execute(
            toolUse.name,
            toolUse.input as Record<string, unknown>
          );
          
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: result,
          });
        } catch (error) {
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: `Error: ${error}`,
            is_error: true,
          });
        }
      }

      // Add assistant message and tool results to conversation
      currentMessage.push({
        role: 'assistant',
        content: response.content,
      });
      
      currentMessage.push({
        role: 'user',
        content: toolResults,
      });
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

export default GitHubAgent;
