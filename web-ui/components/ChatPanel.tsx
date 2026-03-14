'use client'

import { useState, useEffect } from 'react'
import { Send, Bot, User, Loader2, CheckCircle2, Circle, AlertCircle } from 'lucide-react'

interface Stage {
  name: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  message?: string
}

interface TaskStatus {
  id: string
  type: string
  status: string
  progress: number
  stages: Stage[]
  result?: any
  error?: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  taskId?: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是 GitHub 智能助手。\n\n请告诉我你想开发什么功能，我会帮你：\n\n1. 澄清需求 (直到 90% 明确)\n2. 生成 OpenSpec 计划\n3. 拆分任务并上传 GitHub\n4. 自动执行、Review、提交 PR\n5. 运行 CI/CD\n\n开始吧！',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTask, setActiveTask] = useState<TaskStatus | null>(null)

  useEffect(() => {
    if (!activeTask) return
    
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/task/${activeTask.id}`)
        const task: TaskStatus = await res.json()
        setActiveTask(task)
        
        if (task.status === 'completed' || task.status === 'failed') {
          clearInterval(interval)
        }
      } catch (error) {
        console.error('Failed to poll task status:', error)
      }
    }, 2000)
    
    return () => clearInterval(interval)
  }, [activeTask])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/requirement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement: input }),
      })
      
      const data = await res.json()
      
      if (data.success) {
        // 开始轮询任务状态
        const taskRes = await fetch(`${API_BASE}/api/task/${data.taskId}`)
        const task: TaskStatus = await taskRes.json()
        setActiveTask(task)
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '收到你的需求！正在处理中...',
          timestamp: new Date(),
          taskId: data.taskId,
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 任务进度面板 */}
      {activeTask && (
        <div className="border-b p-4 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">执行进度</h3>
            <span className="text-sm text-gray-500">{activeTask.progress.toFixed(1)}%</span>
          </div>
          <div className="space-y-2">
            {activeTask.stages.map((stage, index) => (
              <div key={index} className="flex items-center gap-3">
                {stage.status === 'completed' && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                {stage.status === 'in_progress' && (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                )}
                {stage.status === 'pending' && (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
                {stage.status === 'failed' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                <span className={
                  stage.status === 'completed' ? 'text-green-700 dark:text-green-400' :
                  stage.status === 'in_progress' ? 'text-blue-700 dark:text-blue-400 font-medium' :
                  stage.status === 'failed' ? 'text-red-700 dark:text-red-400' :
                  'text-gray-500'
                }>
                  {stage.name}
                </span>
                {stage.message && (
                  <span className="text-sm text-gray-400">- {stage.message}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 消息列表 */}
      <div className="flex-1 overflow-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-2xl rounded-lg px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-2 opacity-50">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* 输入框 */}
      <div className="border-t p-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="描述你的需求..."
            className="flex-1 rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="rounded-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
