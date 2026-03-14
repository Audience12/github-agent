---
name: milestone-planner
description: Plan and organize GitHub milestones with OpenSpec specs
---

# Milestone Planner Skill

Plans GitHub milestones and creates OpenSpec specifications for linked issues.

## Workflow

1. **Fetch Milestone** - Get milestone details and linked issues
2. **Analyze Issues** - Understand each issue's requirements
3. **Prioritize** - Order issues by dependencies and importance
4. **Create Specs** - Generate OpenSpec for the milestone

## Milestone Spec Structure

\`\`\`
openspec/milestones/<milestone-name>/
├── overview.md          # Milestone summary
├── roadmap.md           # Timeline and phases
├── issues/
│   ├── <issue-1>.md     # Spec for issue 1
│   ├── <issue-2>.md     # Spec for issue 2
│   └── ...
└── dependencies.md      # Issue dependencies graph
\`\`\`

## Prioritization Rules

1. **Blocking issues first** - Issues that others depend on
2. **Foundation features** - Core functionality
3. **Enhancements** - Nice-to-have improvements
4. **Bug fixes** - Address alongside features

## Timeline Estimation

- Small issues: 1-2 days
- Medium issues: 3-5 days
- Large issues: 1-2 weeks
- Extra large: Split into smaller issues

## Usage

Ask the agent:
- "Plan milestone v2.0"
- "What's the roadmap for the Q1 milestone?"
- "Create specs for all issues in milestone 'beta-release'"
