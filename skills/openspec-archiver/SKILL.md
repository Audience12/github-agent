---
name: openspec-archiver
description: OpenSpec 文档归档管理。自动归档提案、规格、变更记录到项目中，形成完整的迭代历史。
---

# OpenSpec Archiver (文档归档)

将 OpenSpec 生成的文档归档到项目中，形成完整的迭代历史记录。

## 目录结构

```
project/
├── openspec/
│   ├── active/                    # 活跃的变更
│   │   └── user-login/
│   │       ├── proposal.md
│   │       ├── specs/
│   │       └── tasks/
│   ├── archive/                   # 已完成的变更
│   │   ├── 2026-03/
│   │   │   ├── user-login/
│   │   │   └── payment-system/
│   │   └── 2026-04/
│   └── templates/                 # 模板
│       ├── proposal.md
│       └── specs/
├── docs/
│   ├── changelog/                 # 变更日志
│   │   ├── 2026-03.md
│   │   └── 2026-04.md
│   ├── decisions/                 # 架构决策记录 (ADR)
│   │   ├── 001-database-choice.md
│   │   └── 002-auth-strategy.md
│   └── roadmap/                   # 路线图
│       └── 2026-q1.md
└── .openspec                      # OpenSpec 配置
```

---

## 归档流程

### 1. 变更开始 (Change Start)

```bash
# 创建新的变更目录
openspec/active/<feature-slug>/
├── proposal.md          # 提案
├── specs/               # 规格文档
│   ├── requirements.md
│   ├── scenarios.md
│   └── constraints.md
├── design/              # 设计文档
│   └── architecture.md
└── tasks/               # 任务分解
    └── breakdown.md
```

### 2. 变更进行中 (In Progress)

更新文档：
- 记录设计决策
- 更新任务状态
- 添加实现笔记

### 3. 变更完成 (Change Complete)

归档到：
```
openspec/archive/YYYY-MM/<feature-slug>/
├── proposal.md
├── specs/
├── design/
├── tasks/
├── implementation.md    # 实现总结
└── metrics.md          # 完成指标
```

---

## 文档类型

### Proposal (提案)

```markdown
# Proposal: <Feature Name>

**Status**: proposed | in-progress | completed | cancelled
**Created**: 2026-03-15
**Completed**: 2026-03-20
**Issue**: #123
**PR**: #145

## Why
<为什么做这个>

## What
<做了什么>

## How
<怎么实现的>

## Outcome
<最终结果>

## Lessons Learned
<经验教训>
```

### Spec (规格)

```markdown
# Requirements: <Feature Name>

## Functional Requirements
- FR-001: 需求描述
- FR-002: 需求描述

## Non-Functional Requirements
- NFR-001: 性能要求
- NFR-002: 安全要求

## Acceptance Criteria
- [ ] AC-001: 验收标准
- [ ] AC-002: 验收标准

## Dependencies
- DEP-001: 依赖项
```

### Implementation Summary (实现总结)

```markdown
# Implementation: <Feature Name>

## What Was Done
- 实现了什么
- 用了什么技术

## Changes Made
- 文件变更列表
- API 变更
- 数据库变更

## Testing
- 单元测试: XX 覆盖率
- 集成测试: XX 用例
- E2E 测试: XX 场景

## Performance
- 响应时间: XXms
- 吞吐量: XX req/s

## Issues Encountered
- 问题1: 解决方案
- 问题2: 解决方案
```

---

## CHANGELOG 生成

每次归档自动更新 CHANGELOG：

```markdown
# Changelog: 2026-03

## 2026-03-20 - User Login Feature

### Added
- 用户登录功能 (closes #123)
- 记住登录状态
- 登录失败锁定

### Changed
- 更新认证模块

### Fixed
- 修复 Token 过期问题

### Technical
- 新增 `/api/auth/login` 接口
- 更新数据库 User 表
- 单元测试覆盖率 85%

---

## 2026-03-15 - Payment System

### Added
- 支付系统 MVP
...
```

---

## ADR (架构决策记录)

重要决策记录在 `docs/decisions/`：

```markdown
# ADR-001: 使用 JWT 进行认证

**Status**: Accepted
**Date**: 2026-03-15
**Decision Makers**: @user

## Context
需要选择用户认证方案。

## Decision
使用 JWT (JSON Web Token) 进行认证。

## Rationale
- 无状态，易扩展
- 跨服务支持
- 业界标准

## Consequences
- Token 无法主动失效
- 需要刷新机制

## Alternatives Considered
- Session + Cookie: 需要共享存储
- OAuth: 过于复杂

## Related
- Proposal: user-login
- Issue: #123
```

---

## 迭代历史查询

### 按时间查询

```bash
# 查看 2026年3月 的变更
ls openspec/archive/2026-03/
```

### 按功能查询

```bash
# 查看用户登录的完整历史
cat openspec/archive/2026-03/user-login/proposal.md
cat openspec/archive/2026-03/user-login/implementation.md
```

### 生成报告

```bash
# 生成月度报告
openspec report --month 2026-03

# 输出:
# - 完成功能: 5
# - 代码变更: +2500/-800
# - 测试覆盖率: 82%
# - Bug 修复: 3
```

---

## 与 Git 集成

### 提交信息规范

```
feat(auth): implement user login (#123)

- Add login API endpoint
- Implement JWT authentication
- Add unit tests (85% coverage)

Closes #123
Proposal: openspec/archive/2026-03/user-login
```

### Git Tags

```bash
# 完成功能后打标签
git tag -a v1.1.0 -m "User login feature"
git push origin v1.1.0
```

---

## 配置

```json
{
  "archive": {
    "path": "openspec/archive",
    "groupBy": "month",
    "autoChangelog": true,
    "autoADR": true
  },
  "changelog": {
    "path": "docs/changelog",
    "format": "markdown"
  },
  "decisions": {
    "path": "docs/decisions",
    "prefix": "ADR"
  }
}
```

---

## 归档命令

```bash
# 开始新变更
openspec propose "user-login"

# 更新变更
openspec update "user-login" --status in-progress

# 完成并归档
openspec archive "user-login" --merge-pr 145

# 查看历史
openspec history "user-login"

# 生成报告
openspec report --month 2026-03
```

---

## 使用场景

### 场景 1: 新功能开发

```
智能体: 开始实现用户登录功能

1. 创建提案: openspec/active/user-login/
2. 编写规格: specs/requirements.md
3. 实现功能
4. 完成归档: openspec/archive/2026-03/user-login/
5. 更新 CHANGELOG
```

### 场景 2: 查询历史

```
用户: 上个月我们做了什么?

智能体: 查看 openspec/archive/2026-02/ ...

2026年2月完成的变更:
1. 支付系统 - PR #120
2. 用户注册 - PR #115
3. 邮件通知 - PR #110
```

### 场景 3: 技术决策回顾

```
用户: 我们为什么用 JWT?

智能体: 查看架构决策记录...

根据 ADR-001 (2026-03-15):
- 选择 JWT 是因为无状态、易扩展
- 替代方案是 Session+Cookie
- 相关 Issue: #123
```
