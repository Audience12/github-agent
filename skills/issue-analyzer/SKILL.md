---
name: issue-analyzer
description: Analyze GitHub issues and generate OpenSpec proposals for implementation
---

# Issue Analyzer Skill

Analyzes GitHub issues and creates OpenSpec-compliant proposals.

## Workflow

1. **Fetch Issue** - Get issue details from GitHub
2. **Analyze Content** - Understand the problem and requirements
3. **Generate Proposal** - Create OpenSpec proposal structure
4. **Create Specs** - Generate requirements and scenarios

## OpenSpec Output Structure

\`\`\`
openspec/changes/<issue-title-slug>/
├── proposal.md          # Why we're doing this, what's changing
├── specs/
│   ├── requirements.md  # What must be implemented
│   ├── scenarios.md     # Usage scenarios
│   └── constraints.md   # Limitations and edge cases
└── tasks/
    └── implementation.md # Step-by-step tasks
\`\`\`

## Proposal Template

\`\`\`markdown
# Proposal: <Feature Name>

## Why
<Explain the motivation - what problem does this solve?>

## What
<Describe the changes at a high level>

## Impact
- User impact: <How does this affect users?>
- System impact: <How does this affect the system?>

## Dependencies
<List any dependencies on other features or systems>
\`\`\`

## Usage

Ask the agent:
- "Analyze issue #123 and create a proposal"
- "What specs should we create for this feature request?"
- "Generate an OpenSpec proposal for the bug in issue #45"
