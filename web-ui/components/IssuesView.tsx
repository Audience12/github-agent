'use client'

import { useState, useEffect } from 'react'
import { ListTodo, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface Task {
  id: string
  type: string
  status: string
  progress: number
  stages: any[]
  createdAt: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export function IssuesView() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
    const interval = setInterval(fetchTasks, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks`)
      const data = await res.json()
      setTasks(data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <ListTodo className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">任务列表</h2>
        <button
          onClick={fetchTasks}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          刷新
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">暂无任务</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(task.status)}
                  <div>
                    <h3 className="font-medium">{task.type.toUpperCase()}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{task.progress.toFixed(1)}%</div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
