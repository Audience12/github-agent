# GitHub Intelligent Agent

AI-powered GitHub assistant with OpenSpec + GLM integration.

## 项目结构

```
github-agent/
├── src/                    # 后端 Agent
│   ├── agent/             # Agent 核心
│   ├── api/               # REST API
│   └── webhooks/          # GitHub Webhooks
├── web-ui/                # React 前端
│   ├── app/               # Next.js App Router
│   └── components/        # React 组件
└── skills/                # Skills
    ├── requirement-to-delivery/
    ├── code-review/
    ├── issue-analyzer/
    ├── milestone-planner/
    └── openspec-archiver/
```

## 快速开始

```bash
# 安装所有依赖
npm run install:all

# 配置环境变量
export GITHUB_TOKEN="ghp_xxx"
export LLM_API_KEY="xxx"
export LLM_PROVIDER="zhipu"
export LLM_BASE_URL="https://open.bigmodel.cn/api/anthropic"

# 启动后端
npm run dev

# 启动前端 (另一个终端)
npm run dev:ui
```

## API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/requirement` | POST | 提交需求，启动完整流程 |
| `/api/task/:id` | GET | 查询任务状态 |
| `/api/tasks` | GET | 列出所有任务 |
| `/api/issue/analyze` | POST | 分析 Issue |
| `/api/pr/review` | POST | Review PR |
| `/api/milestone/plan` | POST | 规划里程碑 |

## 执行流程

```
1. 需求澄清 (90%) → 2. 生成计划 → 3. 任务拆分
     ↓
4. 上传 GitHub → 5. 执行任务 → 6. 代码审查
     ↓
7. 提交 PR → 8. CI/CD → 9. 完成
```

## 技术栈

- **后端**: Express + TypeScript + OpenSpec
- **前端**: Next.js 14 + React + Tailwind CSS
- **LLM**: GLM (智谱 AI)
- **部署**: Docker + Vercel

## License

MIT
