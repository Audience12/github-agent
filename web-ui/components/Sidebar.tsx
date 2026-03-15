'use client'

import { MessageSquare, AlertCircle, GitPullRequest, Flag } from 'lucide-react'

interface SidebarProps {
  activeView: 'chat' | 'issues' | 'prs' | 'milestones'
  onViewChange: (view: 'chat' | 'issues' | 'prs' | 'milestones') => void
}

const navItems = [
  { id: 'chat' as const, label: 'Chat', icon: MessageSquare },
  { id: 'issues' as const, label: 'Issues', icon: AlertCircle },
  { id: 'prs' as const, label: 'Pull Requests', icon: GitPullRequest },
  { id: 'milestones' as const, label: 'Milestones', icon: Flag },
]

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 border-r bg-gray-50 dark:bg-gray-900 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          GitHub Agent
        </h1>
        <p className="text-sm text-gray-500 mt-1">AI-powered assistant</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeView === item.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-8 pt-8 border-t">
        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
            + New Issue
          </button>
          <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
            + New PR
          </button>
          <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
            📊 View Analytics
          </button>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 text-white">
          <h4 className="font-semibold mb-1">OpenSpec Ready</h4>
          <p className="text-xs opacity-80">
            Spec-driven development with AI assistance
          </p>
        </div>
      </div>
    </aside>
  )
}
