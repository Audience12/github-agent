'use client'

import { MessageSquare, ListTodo, GitPullRequest, Flag } from 'lucide-react'

interface SidebarProps {
  activeView: 'chat' | 'issues' | 'prs' | 'milestones'
  onViewChange: (view: 'chat' | 'issues' | 'prs' | 'milestones') => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const navItems = [
    { id: 'chat' as const, label: 'Chat', icon: MessageSquare },
    { id: 'issues' as const, label: 'Issues', icon: ListTodo },
    { id: 'prs' as const, label: 'Pull Requests', icon: GitPullRequest },
    { id: 'milestones' as const, label: 'Milestones', icon: Flag },
  ]

  return (
    <nav className="w-64 border-r bg-gray-50 dark:bg-gray-900 p-4">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === item.id
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold text-sm mb-2">Quick Actions</h3>
        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
          <li>• Analyze Issue</li>
          <li>• Review PR</li>
          <li>• Plan Milestone</li>
          <li>• Generate OpenSpec</li>
        </ul>
      </div>
    </nav>
  )
}
