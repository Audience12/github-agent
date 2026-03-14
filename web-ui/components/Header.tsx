'use client'

import { Github, Bot } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b bg-white dark:bg-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Github className="w-8 h-8" />
            <Bot className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold">GitHub Intelligent Agent</h1>
            <p className="text-sm text-gray-500">AI-powered development assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Powered by OpenSpec</span>
        </div>
      </div>
    </header>
  )
}
