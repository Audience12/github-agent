import express, { Request, Response } from 'express';
import { GitHubAgent } from '../agent/index.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

let agent: GitHubAgent;

// 任务状态存储
interface TaskStatus {
  id: string;
  type: 'requirement' | 'issue' | 'pr' | 'milestone';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  stages: Stage[];
  result?: any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Stage {
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  message?: string;
}

const tasks = new Map<string, TaskStatus>();

export function createAPIServer(githubAgent: GitHubAgent) {
  agent = githubAgent;

  // Health check
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 提交需求 - 启动完整流程
  app.post('/api/requirement', async (req: Request, res: Response) => {
    try {
      const { requirement } = req.body;
      
      const taskId = uuidv4();
      const task: TaskStatus = {
        id: taskId,
        type: 'requirement',
        status: 'pending',
        progress: 0,
        stages: [
          { name: '需求澄清', status: 'pending' },
          { name: '生成计划', status: 'pending' },
          { name: '任务拆分', status: 'pending' },
          { name: '上传GitHub', status: 'pending' },
          { name: '执行任务', status: 'pending' },
          { name: '代码审查', status: 'pending' },
          { name: '提交PR', status: 'pending' },
          { name: 'CI/CD', status: 'pending' },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      tasks.set(taskId, task);
      
      // 异步执行任务
      executeRequirementTask(taskId, requirement);
      
      res.json({ success: true, taskId });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // 查询任务状态
  app.get('/api/task/:taskId', (req: Request, res: Response) => {
    const task = tasks.get(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  });

  // 列出所有任务
  app.get('/api/tasks', (req: Request, res: Response) => {
    const allTasks = Array.from(tasks.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    res.json(allTasks);
  });

  // 继续需求澄清
  app.post('/api/requirement/:taskId/clarify', async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const { answer } = req.body;
      
      const task = tasks.get(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      // 处理用户回答并继续澄清
      const result = await agent.chat(answer);
      
      res.json({ success: true, response: result });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // 分析 Issue
  app.post('/api/issue/analyze', async (req: Request, res: Response) => {
    try {
      const { owner, repo, issue_number } = req.body;
      const result = await agent.analyzeIssue(owner, repo, issue_number);
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Review PR
  app.post('/api/pr/review', async (req: Request, res: Response) => {
    try {
      const { owner, repo, pull_number } = req.body;
      const result = await agent.reviewPR(owner, repo, pull_number);
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // 规划里程碑
  app.post('/api/milestone/plan', async (req: Request, res: Response) => {
    try {
      const { owner, repo, milestone_id } = req.body;
      const result = await agent.planMilestone(owner, repo, milestone_id);
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Chat
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      const result = await agent.chat(message);
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  return app;
}

// 异步执行需求任务
async function executeRequirementTask(taskId: string, requirement: string) {
  const task = tasks.get(taskId);
  if (!task) return;

  try {
    // 阶段 1: 需求澄清
    updateStage(task, 0, 'in_progress', '开始分析需求...');
    task.status = 'in_progress';
    task.updatedAt = new Date();
    
    const clarifyResult = await agent.chat(
      `用户需求: ${requirement}\n\n请分析这个需求，并提出澄清问题。`
    );
    
    updateStage(task, 0, 'completed', '需求已分析');
    task.progress = 12.5;
    task.updatedAt = new Date();
    
    // 阶段 2-8: 后续阶段 (需要用户交互后继续)
    // 这里简化处理，实际需要更复杂的状态机
    
  } catch (error) {
    task.status = 'failed';
    task.error = String(error);
    task.updatedAt = new Date();
  }
}

function updateStage(task: TaskStatus, index: number, status: Stage['status'], message?: string) {
  if (task.stages[index]) {
    task.stages[index].status = status;
    task.stages[index].message = message;
  }
}

export { app };
