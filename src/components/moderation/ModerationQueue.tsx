'use client'

import { useState, useEffect } from 'react'
import { Loader2, AlertTriangle, AlertCircle, Trash2, Ban, Eye } from 'lucide-react'

interface FlaggedItem {
  id: string
  contentType: string
  contentId: string
  reason: string
  description?: string
  flaggedBy: string
  severity: number
  priority: string
  createdAt: string
}

interface QueueStats {
  pending: number
  critical: number
  high: number
}

export function ModerationQueue() {
  const [queue, setQueue] = useState<FlaggedItem[]>([])
  const [stats, setStats] = useState<QueueStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [priority, setPriority] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    loadQueue()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, priority, page])

  async function loadQueue() {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: String(page),
        status: filter,
        ...(priority && { priority }),
      })

      const response = await fetch(`/api/moderation/queue?${params}`)
      if (!response.ok) throw new Error('Failed to fetch queue')

      const data = await response.json()
      setQueue(data.queue)
      setStats(data.stats)
      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Error loading queue:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-500/20 border-red-500 text-red-200',
      high: 'bg-orange-500/20 border-orange-500 text-orange-200',
      medium: 'bg-yellow-500/20 border-yellow-500 text-yellow-200',
      low: 'bg-blue-500/20 border-blue-500 text-blue-200',
    }
    return colors[priority] || colors.low
  }

  const getSeverityPercentage = (severity: number) => {
    if (severity >= 80) return 'Critical'
    if (severity >= 60) return 'High'
    if (severity >= 40) return 'Medium'
    return 'Low'
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin text-sage-500" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card-dark p-4 text-center border-l-4 border-yellow-500">
            <p className="text-white/60 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
          </div>
          <div className="card-dark p-4 text-center border-l-4 border-orange-500">
            <p className="text-white/60 text-sm">High Priority</p>
            <p className="text-2xl font-bold text-orange-400">{stats.high}</p>
          </div>
          <div className="card-dark p-4 text-center border-l-4 border-red-500">
            <p className="text-white/60 text-sm">Critical</p>
            <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value)
            setPage(1)
          }}
          className="bg-white/10 text-white text-sm rounded px-3 py-2"
        >
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="all">All</option>
        </select>

        <select
          value={priority || ''}
          onChange={(e) => {
            setPriority(e.target.value || null)
            setPage(1)
          }}
          className="bg-white/10 text-white text-sm rounded px-3 py-2"
        >
          <option value="">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Queue Items */}
      <div className="space-y-2">
        {queue.length === 0 ? (
          <div className="card-dark p-8 text-center">
            <p className="text-white/60">No items in queue</p>
          </div>
        ) : (
          queue.map((item) => (
            <div
              key={item.id}
              className={`card-dark p-4 border-l-4 ${getPriorityColor(item.priority)} border`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {item.priority === 'critical' && (
                      <AlertTriangle size={18} className="text-red-400" />
                    )}
                    {item.priority === 'high' && (
                      <AlertCircle size={18} className="text-orange-400" />
                    )}
                    <span className="font-semibold text-white">
                      {item.contentType.toUpperCase()} reported
                    </span>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded">
                      Severity: {getSeverityPercentage(item.severity)}
                    </span>
                  </div>

                  <p className="text-white/70 text-sm mb-2">
                    <strong>Reason:</strong> {item.reason}
                  </p>

                  {item.description && (
                    <p className="text-white/60 text-sm mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <p className="text-white/40 text-xs">
                    Reported {new Date(item.createdAt).toLocaleDateString()} •{' '}
                    ID: {item.contentId.substring(0, 8)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="btn-ghost p-2" title="View content">
                    <Eye size={18} />
                  </button>
                  <button className="p-2 hover:bg-orange-500/20 rounded transition" title="Warn user">
                    <AlertCircle size={18} className="text-orange-400" />
                  </button>
                  <button className="p-2 hover:bg-red-500/20 rounded transition" title="Ban user">
                    <Ban size={18} className="text-red-400" />
                  </button>
                  <button className="p-2 hover:bg-red-500/20 rounded transition" title="Remove content">
                    <Trash2 size={18} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setPage(page + 1)}
            className="btn-primary"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}
