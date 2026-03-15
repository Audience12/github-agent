/**
 * 完整实验：创建 Issue → Agent 分析 → 生成 OpenSpec 提案
 */

import 'dotenv/config';
import { GitHubAgent } from './agent/index.js';
import { Octokit } from '@octokit/rest';

async function main() {
  console.log('🧪 开始完整实验\n');

  const githubToken = process.env.GITHUB_TOKEN!;
  const llmApiKey = process.env.LLM_API_KEY!;
  const llmBaseUrl = process.env.LLM_BASE_URL;

  const octokit = new Octokit({ auth: githubToken });
  const agent = new GitHubAgent({
    githubToken,
    llmProvider: 'zhipu',
    llmApiKey,
    llmBaseUrl,
  });

  // 步骤 1: 创建一个测试 Issue
  console.log('📝 步骤 1: 创建测试 Issue...');
  
  const issue = await octokit.issues.create({
    owner: 'Audience12',
    repo: 'fastapi-demo',
    title: '[Agent Test] 添加健康检查 API',
    body: `## 需求描述

为 fastapi-demo 项目添加一个健康检查 API 端点。

## 功能要求

- 新增 \`GET /health\` 端点
- 返回 JSON 格式：\`{"status": "ok", "timestamp": "2024-xx-xx"}\`
- 不需要认证
- 添加单元测试

## 验收标准

- [ ] API 端点可访问
- [ ] 返回正确的 JSON 格式
- [ ] 测试通过

---
*此 Issue 由 GitHub Agent 自动创建用于测试*
`,
    labels: ['enhancement', 'test'],
  });

  console.log(`✅ Issue 已创建: ${issue.data.html_url}\n`);

  // 步骤 2: 让 Agent 分析这个 Issue
  console.log('🤖 步骤 2: Agent 分析 Issue...\n');

  const analysis = await agent.chat(
    `请分析 Audience12/fastapi-demo 仓库的 Issue #${issue.data.number}，` +
    `并生成一个 OpenSpec 提案来描述如何实现这个功能。` +
    `\n\n包括：\n1. 需求分析\n2. 实现方案\n3. 文件修改列表\n4. 测试计划`
  );

  console.log('分析结果:\n');
  console.log(analysis);
  console.log('\n' + '='.repeat(60) + '\n');

  // 步骤 3: 在 Issue 上添加分析评论
  console.log('💬 步骤 3: 将分析结果发布为评论...');

  const comment = await octokit.issues.createComment({
    owner: 'Audience12',
    repo: 'fastapi-demo',
    issue_number: issue.data.number,
    body: `## 🤖 GitHub Agent 分析报告\n\n${analysis}\n\n---\n*由 GitHub Intelligent Agent 自动生成*`,
  });

  console.log(`✅ 评论已发布: ${comment.data.html_url}\n`);

  // 总结
  console.log('🎉 实验完成！');
  console.log(`   Issue: ${issue.data.html_url}`);
  console.log(`   评论: ${comment.data.html_url}`);
}

main().catch(console.error);
