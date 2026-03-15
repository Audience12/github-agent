/**
 * 实验 2: 自动创建 PR
 * 场景：根据 Issue #1 的需求，自动创建一个 PR 来实现健康检查 API
 */

import 'dotenv/config';
import { GitHubAgent } from './agent/index.js';

async function main() {
  console.log('🧪 实验 2: 自动创建 PR\n');

  const githubToken = process.env.GITHUB_TOKEN!;
  const llmApiKey = process.env.LLM_API_KEY!;
  const llmBaseUrl = process.env.LLM_BASE_URL;

  const agent = new GitHubAgent({
    githubToken,
    llmProvider: 'zhipu',
    llmApiKey,
    llmBaseUrl,
  });

  // 让 Agent 自动实现健康检查 API
  console.log('📝 让 Agent 自动实现 /health 端点...\n');

  const result = await agent.chat(`
请为 Audience12/fastapi-demo 仓库实现健康检查 API。

需求：
1. 创建新分支: feature/health-check
2. 修改 main.py 添加 GET /health 端点
3. 返回格式: {"status": "ok", "timestamp": "ISO8601时间戳"}
4. 创建 PR，标题: "feat: 添加健康检查 API"
5. PR 描述要详细说明实现方案

请使用你的工具自动完成这些步骤。
`);

  console.log('Agent 执行结果:\n');
  console.log(result);
  console.log('\n' + '='.repeat(60) + '\n');

  console.log('🎉 实验 2 完成！');
}

main().catch(console.error);
