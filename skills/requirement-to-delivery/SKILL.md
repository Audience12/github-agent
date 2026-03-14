---
name: requirement-to-delivery
description: 完整的需求到交付自动化流程。用户提出需求后，智能体澄清需求、生成计划、拆分任务、上传GitHub、执行、Review、提交PR、运行CI/CD。
---

# Requirement to Delivery (需求到交付)

完整的需求到交付自动化流程 Skill。

## 工作流程

```
┌─────────────────────────────────────────────────────────────────┐
│                    Requirement to Delivery                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. 需求澄清 (Requirement Clarification)                         │
│     用户输入 → 智能体提问 → 澄清 → 达到90%明确度                   │
│                           ↓                                      │
│  2. 生成计划 (Plan Generation)                                   │
│     需求 → OpenSpec提案 → 详细计划                               │
│                           ↓                                      │
│  3. 任务拆分 (Task Breakdown)                                    │
│     计划 → Epics → Issues → Subtasks                             │
│                           ↓                                      │
│  4. 上传GitHub (GitHub Sync)                                     │
│     任务 → 创建Milestone → 创建Epics → 创建Issues                 │
│                           ↓                                      │
│  5. 执行任务 (Task Execution)                                    │
│     并行/串行执行 → 代码实现 → 单元测试                           │
│                           ↓                                      │
│  6. 代码审查 (Code Review)                                       │
│     Review代码 → 修复问题 → 确认通过                              │
│                           ↓                                      │
│  7. 提交PR (Pull Request)                                        │
│     创建PR → 关联Issue → 等待审核                                 │
│                           ↓                                      │
│  8. CI/CD (持续集成)                                             │
│     自动测试 → 构建 → 部署                                        │
│                           ↓                                      │
│  9. 完成 (Done)                                                  │
│     归档OpenSpec → 关闭Issue → 更新文档                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: 需求澄清 (Requirement Clarification)

### 目标
将模糊需求澄清到 90% 以上明确度。

### 流程
1. 用户提供初始需求
2. 智能体分析需求，识别模糊点
3. 智能体提出针对性问题
4. 用户回答
5. 重复 2-4 直到明确度 >= 90%

### 澄清问题模板

```markdown
## 需求分析

**当前明确度**: XX%

**已明确的部分**:
- [x] 明确点1
- [x] 明确点2

**需要澄清的问题**:

1. **功能性问题**:
   - 问题1?
   - 问题2?

2. **非功能需求**:
   - 性能要求是什么?
   - 安全要求有哪些?

3. **边界条件**:
   - 如果X发生，应该怎么处理?
   - 最大支持多少用户/数据?

4. **技术约束**:
   - 有技术栈限制吗?
   - 需要兼容现有系统吗?

请回答以上问题，以便我更准确地理解需求。
```

### 明确度评估标准

| 维度 | 权重 | 评估项 |
|------|------|--------|
| 功能需求 | 30% | 核心功能是否清晰 |
| 用户场景 | 20% | 使用场景是否明确 |
| 边界条件 | 15% | 异常处理是否定义 |
| 非功能需求 | 15% | 性能/安全/可用性 |
| 技术约束 | 10% | 技术栈/兼容性 |
| 验收标准 | 10% | 如何验证完成 |

---

## Phase 2: 生成计划 (Plan Generation)

### OpenSpec 提案结构

```
openspec/changes/<feature-slug>/
├── proposal.md              # 提案概述
├── specs/
│   ├── requirements.md      # 功能需求
│   ├── scenarios.md         # 用户场景
│   ├── constraints.md       # 约束条件
│   └── acceptance.md        # 验收标准
├── architecture/
│   ├── design.md            # 架构设计
│   └── diagrams/            # 架构图
└── tasks/
    └── breakdown.md         # 任务拆分
```

### proposal.md 模板

```markdown
# Proposal: <Feature Name>

## Why (为什么做)
<业务价值和动机>

## What (做什么)
<功能概述>

## How (怎么做)
<实现方案>

## Impact (影响)
- 用户影响:
- 系统影响:
- 依赖影响:

## Risks (风险)
- 技术风险:
- 进度风险:
- 资源风险:

## Success Metrics (成功指标)
- 指标1:
- 指标2:
```

---

## Phase 3: 任务拆分 (Task Breakdown)

### 拆分规则

1. **Epic** (史诗)
   - 大型功能模块
   - 跨多个 Sprint
   - 示例: "用户认证系统"

2. **Issue** (任务)
   - 具体可执行的任务
   - 1-3 天完成
   - 示例: "实现登录API"

3. **Subtask** (子任务)
   - Issue 的具体步骤
   - 数小时内完成
   - 示例: "编写登录API的单元测试"

### 任务依赖图

```
Epic 1: 用户认证
├── Issue 1.1: 数据库设计
│   ├── Subtask: 设计User表
│   └── Subtask: 创建迁移脚本
├── Issue 1.2: 登录功能 (依赖 1.1)
│   ├── Subtask: 实现登录API
│   ├── Subtask: 编写单元测试
│   └── Subtask: API文档
└── Issue 1.3: 注册功能 (依赖 1.1)
    └── ...
```

---

## Phase 4: 上传GitHub (GitHub Sync)

### 创建顺序

1. **创建 Milestone**
   ```bash
   gh milestone create "v1.0 - 用户认证" \
     --description "完整的用户认证系统" \
     --due-date "2026-04-01"
   ```

2. **创建 Epics** (作为 Issue + epic label)
   ```bash
   gh issue create --title "Epic: 用户认证系统" \
     --label "epic" \
     --milestone "v1.0"
   ```

3. **创建 Issues**
   ```bash
   gh issue create --title "实现登录API" \
     --body "描述..." \
     --label "feature" \
     --milestone "v1.0" \
     --assignee @me
   ```

### Issue 模板

```markdown
## Description
<任务描述>

## Acceptance Criteria
- [ ] 标准1
- [ ] 标准2

## Technical Notes
<技术说明>

## Dependencies
- #123 (前置任务)

## Estimate
- Story Points: X
- Time: X days
```

---

## Phase 5: 执行任务 (Task Execution)

### 执行策略

**并行执行** (Parallel):
- 无依赖的任务
- 不同模块的任务
- 示例: 前端UI + 后端API

**串行执行** (Sequential):
- 有依赖的任务
- 需要按顺序的任务
- 示例: 数据库设计 → API开发

### 执行流程

```bash
# 1. 检出分支
git checkout -b feature/issue-123-login-api

# 2. 实现功能
# ... 编写代码 ...

# 3. 编写单元测试
# ... 编写测试 ...

# 4. 运行测试
npm test

# 5. 本地验证
npm run dev
```

### 单元测试要求

- 每个函数至少 1 个测试
- 覆盖正常流程
- 覆盖边界条件
- 覆盖异常情况
- 代码覆盖率 >= 80%

---

## Phase 6: 代码审查 (Code Review)

### 自查清单

```markdown
## Self Review Checklist

### 代码质量
- [ ] 代码符合项目风格
- [ ] 变量命名清晰
- [ ] 函数职责单一
- [ ] 无重复代码

### 测试
- [ ] 单元测试通过
- [ ] 覆盖率达标
- [ ] 边界条件测试

### 安全
- [ ] 无硬编码密钥
- [ ] 输入验证
- [ ] 权限检查

### 性能
- [ ] 无明显性能问题
- [ ] 数据库查询优化

### 文档
- [ ] 代码注释
- [ ] API文档更新
- [ ] README更新
```

---

## Phase 7: 提交PR (Pull Request)

### PR 模板

```markdown
## What
<这个PR做了什么>

## Why
<为什么要做>

## How
<怎么实现的>

## Testing
- [ ] 单元测试
- [ ] 集成测试
- [ ] 手动测试

## Screenshots
<如有UI变化，附截图>

## Related Issues
Closes #123
```

### 创建PR

```bash
gh pr create \
  --title "feat: 实现登录API" \
  --body-file pr-template.md \
  --base main \
  --head feature/issue-123-login-api
```

---

## Phase 8: CI/CD (持续集成)

### CI 流程

```yaml
# .github/workflows/ci.yml
jobs:
  test:
    - 单元测试
    - 代码覆盖率

  e2e:
    - 端到端测试
    - 集成测试

  build:
    - 构建应用
    - Docker镜像

  deploy:
    - 部署到staging
    - 验证部署
```

### 测试类型

| 类型 | 说明 | 时机 |
|------|------|------|
| 单元测试 | 测试单个函数 | 每次提交 |
| 集成测试 | 测试模块交互 | PR |
| E2E测试 | 测试完整流程 | 合并前 |
| 性能测试 | 测试性能指标 | 发布前 |

---

## Phase 9: 完成 (Done)

### 完成标准

- [ ] 所有测试通过
- [ ] PR 已合并
- [ ] CI/CD 成功
- [ ] Issue 已关闭
- [ ] 文档已更新
- [ ] OpenSpec 已归档

### 归档流程

```bash
# 移动到归档目录
mv openspec/changes/<feature> openspec/archive/

# 更新 CHANGELOG
echo "- <feature>: 描述" >> CHANGELOG.md

# 关闭 Issue
gh issue close 123 --comment "已完成并合并到 main"
```

---

## 使用方式

### 开始新需求

```
用户: 我想做一个用户登录功能

智能体: 好的，让我了解一下更多细节...

【需求澄清 - 当前明确度: 30%】

已明确:
- 用户登录功能

需要澄清:
1. 登录方式支持哪些? (账号密码/手机验证码/第三方登录)
2. 需要记住登录状态吗? 时长多久?
3. 登录失败有限制吗?
4. 需要支持多设备登录吗?

请回答以上问题...
```

### 继续流程

```
用户: [回答问题]

智能体: 【需求澄清 - 当前明确度: 60%】
还需要了解...

用户: [继续回答]

智能体: 【需求澄清 - 当前明确度: 95%】
需求已明确！开始生成计划...

【生成计划】
创建 OpenSpec 提案: openspec/changes/user-login/

【任务拆分】
- Epic: 用户登录系统
  - Issue 1: 设计登录流程
  - Issue 2: 实现登录API
  - Issue 3: 前端登录页面
  - Issue 4: 单元测试

【上传GitHub】
✓ Milestone: v1.0 - 用户登录
✓ Epic #10: 用户登录系统
✓ Issue #11: 设计登录流程
✓ Issue #12: 实现登录API
...

开始执行任务...
```

---

## 配置

```json
{
  "clarification": {
    "targetClarity": 90,
    "maxRounds": 5
  },
  "execution": {
    "strategy": "auto",
    "parallelLimit": 3
  },
  "testing": {
    "unitTestCoverage": 80,
    "requireE2E": true
  },
  "github": {
    "autoCreateIssues": true,
    "autoMergePR": false,
    "requireReview": true
  }
}
```
