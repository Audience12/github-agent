---
name: code-review
description: Review pull requests for code quality, security, and OpenSpec compliance
---

# Code Review Skill

Reviews pull requests for quality, security, and specification compliance.

## Review Checklist

### 1. OpenSpec Compliance
- [ ] Does the code implement the requirements?
- [ ] Are all scenarios covered?
- [ ] Are constraints respected?

### 2. Code Quality
- [ ] Is the code readable and well-organized?
- [ ] Are functions/methods appropriately sized?
- [ ] Is there appropriate documentation?
- [ ] Are variable names descriptive?

### 3. Security
- [ ] No hardcoded credentials
- [ ] Input validation present
- [ ] No SQL injection vulnerabilities
- [ ] Proper authentication/authorization

### 4. Performance
- [ ] No N+1 queries
- [ ] Efficient algorithms
- [ ] Appropriate caching

### 5. Testing
- [ ] Unit tests present
- [ ] Edge cases covered
- [ ] Integration tests if needed

## Review Output Format

\`\`\`markdown
## Code Review: PR #<number>

### Summary
<Brief overview of the changes>

### ✅ Approved
<What looks good>

### ⚠️ Suggestions
<Non-blocking improvements>

### ❌ Issues
<Blocking problems that must be fixed>

### Details
<Specific comments on code sections>
\`\`\`

## Usage

Ask the agent:
- "Review PR #42"
- "Check if PR #10 follows our OpenSpec requirements"
- "What issues do you see in this pull request?"
