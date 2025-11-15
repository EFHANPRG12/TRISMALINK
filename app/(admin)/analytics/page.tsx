'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Link as LinkIcon, List, MousePointerClick } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface AnalyticsData {
  overview: {
    totalShortlinks: number
    activeShortlinks: number
    totalShortlinkClicks: number
    totalLinklists: number
    totalListItems: number
    totalListClicks: number
    totalClicks: number
  }
  clicksOverTime: Array<{ date: string; clicks: number }>
  topShortlinks: Array<{ id: string; name: string; clicks: number }>
  topListItems: Array<{ id: string; title: string; clicks: number; listTitle: string }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState(30)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?days=${timeRange}`)
      const result = await response.json()
      if (response.ok) {
        setData(result)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Failed to load analytics</p>
      </div>
    )
  }

  const stats = [
    { 
      title: 'Total Clicks', 
      value: data.overview.totalClicks.toLocaleString(), 
      icon: MousePointerClick, 
      subtitle: 'All time clicks',
      color: 'text-blue-600'
    },
    { 
      title: 'Shortlinks', 
      value: data.overview.totalShortlinks.toString(), 
      icon: LinkIcon, 
      subtitle: `${data.overview.activeShortlinks} active`,
      color: 'text-green-600'
    },
    { 
      title: 'Link Lists', 
      value: data.overview.totalLinklists.toString(), 
      icon: List, 
      subtitle: `${data.overview.totalListItems} items`,
      color: 'text-purple-600'
    },
    { 
      title: 'Avg. Clicks', 
      value: data.overview.totalShortlinks > 0 
        ? Math.round(data.overview.totalClicks / (data.overview.totalShortlinks + data.overview.totalLinklists)).toString()
        : '0', 
      icon: TrendingUp, 
      subtitle: 'Per link',
      color: 'text-orange-600'
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your links performance
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Clicks Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Clicks Over Time</CardTitle>
          <CardDescription>Daily click activity for the last {timeRange} days</CardDescription>
        </CardHeader>
        <CardContent>
          {data.clicksOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.clicksOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Clicks"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No click data yet. Start sharing your links!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Performers */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Shortlinks */}
        <Card>
          <CardHeader>
            <CardTitle>Top Shortlinks</CardTitle>
            <CardDescription>Most clicked short links</CardDescription>
          </CardHeader>
          <CardContent>
            {data.topShortlinks.length > 0 ? (
              <div className="space-y-4">
                {data.topShortlinks.map((link, index) => (
                  <div key={link.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-600 dark:text-blue-300">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{link.name}</p>
                        <p className="text-sm text-gray-500">{link.clicks} clicks</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600"
                          style={{ 
                            width: `${(link.clicks / (data.topShortlinks[0]?.clicks || 1)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No shortlinks yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top List Items */}
        <Card>
          <CardHeader>
            <CardTitle>Top List Items</CardTitle>
            <CardDescription>Most clicked list links</CardDescription>
          </CardHeader>
          <CardContent>
            {data.topListItems.length > 0 ? (
              <div className="space-y-4">
                {data.topListItems.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center font-bold text-purple-600 dark:text-purple-300">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.listTitle}</p>
                        <p className="text-sm text-gray-500">{item.clicks} clicks</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-600"
                          style={{ 
                            width: `${(item.clicks / (data.topListItems[0]?.clicks || 1)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No list items yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
