'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CreateListDialog } from '@/components/admin/CreateListDialog'
import { Copy, ExternalLink, Trash2, Search, Eye, Edit } from 'lucide-react'
import { toast } from 'sonner'

interface ListItem {
  id: string
  title: string
  url: string
  icon: string | null
  order: number
  clicks: number
  isVisible: boolean
}

interface LinkList {
  id: string
  title: string
  slug: string
  description: string | null
  profileImageUrl: string | null
  theme: string
  backgroundColor: string
  textColor: string
  buttonColor: string
  fontFamily: string
  layout: string
  createdAt: Date
  items: ListItem[]
}

export default function ListsPage() {
  const router = useRouter()
  const [lists, setLists] = useState<LinkList[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchLists = async () => {
    try {
      const response = await fetch('/api/lists')
      const data = await response.json()
      if (response.ok) {
        setLists(data.lists)
      }
    } catch (error) {
      console.error('Failed to fetch lists:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLists()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this list and all its items?')) return

    try {
      const response = await fetch(`/api/lists/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setLists(lists.filter(list => list.id !== id))
        toast.success('List deleted successfully')
      } else {
        toast.error('Failed to delete list')
      }
    } catch (error) {
      console.error('Failed to delete list:', error)
      toast.error('An error occurred while deleting')
    }
  }

  const handleCopy = (slug: string) => {
    const baseUrl = window.location.origin
    const url = `${baseUrl}/u/${slug}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  const filteredLists = lists.filter(list => {
    const query = searchQuery.toLowerCase()
    return (
      list.title.toLowerCase().includes(query) ||
      list.slug.toLowerCase().includes(query) ||
      list.description?.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Link Lists
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create and manage your link-in-bio pages
          </p>
        </div>
        <CreateListDialog onSuccess={fetchLists} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Link Lists</CardTitle>
              <CardDescription>{lists.length} total lists</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : filteredLists.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No lists found matching your search' : 'No link lists yet. Create your first one!'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Links</TableHead>
                    <TableHead>Theme</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLists.map((list) => {
                    const publicUrl = `${window.location.origin}/u/${list.slug}`
                    const totalClicks = list.items.reduce((sum, item) => sum + item.clicks, 0)
                    
                    return (
                      <TableRow key={list.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{list.title}</div>
                            {list.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {list.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-blue-600 dark:text-blue-400">/u/{list.slug}</code>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{list.items.length} links</Badge>
                            {totalClicks > 0 && (
                              <Badge variant="outline">{totalClicks} clicks</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: list.buttonColor }}
                              title={`Button: ${list.buttonColor}`}
                            />
                            <span className="text-sm text-gray-500">{list.fontFamily}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(list.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/lists/${list.id}`)}
                              title="Edit list"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(publicUrl, '_blank')}
                              title="View public page"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(list.slug)}
                              title="Copy link"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(list.id)}
                              title="Delete list"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
