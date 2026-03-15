/**
 * 测试 GitHub Agent
 * 测试场景：分析 fastapi-demo 仓库的 issue
 */

import 'dotenv/config';
import { GitHubAgent } from './agent/index.js';

async function main() {
  console.log('🚀 启动 GitHub Agent 测试\n');

  // 检查环境变量
  const githubToken = process.env.GITHUB_TOKEN;
  const llmApiKey = process.env.LLM_API_KEY;
  const llmBaseUrl = process.env.LLM_BASE_URL;

  if (!githubToken) {
    console.error('❌ 缺少 GITHUB_TOKEN');
    process.exit(1);
  }

  if (!llmApiKey) {
    console.error('❌ 缺少 LLM_API_KEY');
    process.exit(1);
  }

  console.log('✅ 环境变量检查通过');
  console.log(`   GITHUB_TOKEN: ${githubToken.substring(0, 10)}...`);
  console.log(`   LLM_API_KEY: ${llmApiKey.substring(0, 10)}...`);
  console.log(`   LLM_BASE_URL: ${llmBaseUrl}\n`);

  // 创建 Agent
  const agent = new GitHubAgent({
    githubToken,
    llmProvider: 'zhipu',
    llmApiKey,
    llmBaseUrl,
  });

  console.log('🤖 Agent 已创建\n');

  // 测试 1: 列出 fastapi-demo 的 issues
  console.log('📋 测试 1: 列出 Audience12/fastapi-demo 的 issues\n');
  
  try {
    const result1 = await agent.chat('请列出 Audience12/fastapi-demo 仓库的所有 open 状态的 issues');
    console.log('结果:\n', result1);
    console.log('\n' + '='.repeat(50) + '\n');
  } catch (error) {
    console.error('❌ 测试 1 失败:', error);
  }

  // 测试 2: 简单对话
  console.log('💬 测试 2: 简单对话\n');
  
  try {
    const result2 = await agent.chat('你好，请简单介绍一下你自己');
    console.log('结果:\n', result2);
    console.log('\n' + '='.repeat(50) + '\n');
  } catch (error) {
    console.error('❌ 测试 2 失败:', error);
  }

  console.log('✅ 测试完成');
}

main().catch(console.error);
