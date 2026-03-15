'use client'

import { useState, useEffect } from 'react'
import { Circle, CheckCircle, XCircle, Tag, MessageSquare, ExternalLink, RefreshCw, Loader2 } from 'lucide-react'

interface Issue {
  id: number
  number: number
  title: string
  body: string
  state: 'open' | 'closed'
  labels: Array<{ name: string; color: string }>
  comments: number
  html_url: string
  created_at: string
  user: { login: string }
}

interface IssuesViewProps {
  onSelectIssue?: (issue: Issue) => void
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export function IssuesView({ onSelectIssue }: IssuesViewProps) {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [owner, setOwner] = useState('Audience12')
  const [repo, setRepo] = useState('fastapi-demo')

  useEffect(() => {
    fetchIssues()
  }, [owner, repo])

  const fetchIssues = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `List all open issues in ${owner}/${repo}. Return only the JSON data.`
        }),
      })
      const data = await res.json()
      
      // Parse issues from response
      if (data.result) {
        try {
          // Try to extract JSON from the response
          const jsonMatch = data.result.match(/\[[\s\S]*\]/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            setIssues(Array.isArray(parsed) ? parsed : [])
          } else {
            setIssues([])
          }
        } catch {
          setIssues([])
        }
      }
    } catch (err) {
      setError('Failed to fetch issues')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Issues</h2>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="Owner"
            className="px-3 py-1 border rounded text-sm w-28"
          />
          <span className="text-gray-400">/</span>
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="Repo"
            className="px-3 py-1 border rounded text-sm w-32"
          />
          <button
            onClick={fetchIssues}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <p>No open issues! 🎉</p>
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => onSelectIssue?.(issue)}
              className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            >
              <div className="flex items-start gap-3">
                {issue.state === 'open' ? (
                  <Circle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:text-blue-600 flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {issue.title}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    {issue.labels.map((label) => (
                      <span
                        key={label.name}
                        className="px-2 py-0.5 text-xs rounded-full"
                        style={{
                          backgroundColor: `#${label.color}20`,
                          color: `#${label.color}`,
                          border: `1px solid #${label.color}40`,
                        }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    #{issue.number} opened {new Date(issue.created_at).toLocaleDateString()} by {issue.user?.login || 'unknown'}
                    {issue.comments > 0 && (
                      <span className="ml-3 flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {issue.comments}
                      </span>
                    )}
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
