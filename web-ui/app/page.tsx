'use client'

import { useState } from 'react'
import { ChatPanel } from '@/components/ChatPanel'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { IssuesView } from '@/components/IssuesView'

export default function Home() {
  const [activeView, setActiveView] = useState<'chat' | 'issues' | 'prs' | 'milestones'>('chat')

  return (
    <main className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1 overflow-auto">
          {activeView === 'chat' && <ChatPanel />}
          {activeView === 'issues' && <IssuesView />}
          {activeView === 'prs' && <PRsView />}
          {activeView === 'milestones' && <MilestonesView />}
        </div>
      </div>
    </main>
  )
}

function IssuesView() {
  return (
    <div className="p-6">
      <IssuesViewContent />
    </div>
  )
}

function IssuesViewContent() {
  'use client'
  return <IssuesView />
}

function PRsView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pull Requests</h2>
      <p className="text-gray-500">PR management coming soon...</p>
    </div>
  )
}

function MilestonesView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Milestones</h2>
      <p className="text-gray-500">Milestone management coming soon...</p>
    </div>
  )
}
