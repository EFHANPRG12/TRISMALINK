'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CreateShortlinkDialog } from '@/components/admin/CreateShortlinkDialog'
import { Copy, ExternalLink, QrCode, Trash2, Search, BarChart } from 'lucide-react'
import { toast } from 'sonner'

interface Shortlink {
  id: string
  shortCode: string
  originalUrl: string
  customAlias: string | null
  description: string | null
  tags: string | null
  clicks: number
  isActive: boolean
  expiresAt: Date | null
  createdAt: Date
}

export default function LinksPage() {
  const [shortlinks, setShortlinks] = useState<Shortlink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchShortlinks = async () => {
    try {
      const response = await fetch('/api/shortlinks')
      const data = await response.json()
      if (response.ok) {
        setShortlinks(data.shortlinks)
      }
    } catch (error) {
      console.error('Failed to fetch shortlinks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchShortlinks()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return

    try {
      const response = await fetch(`/api/shortlinks/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setShortlinks(shortlinks.filter(link => link.id !== id))
        toast.success('Shortlink deleted successfully')
      } else {
        toast.error('Failed to delete shortlink')
      }
    } catch (error) {
      console.error('Failed to delete shortlink:', error)
      toast.error('An error occurred while deleting')
    }
  }

  const handleCopy = (shortCode: string, customAlias: string | null) => {
    const baseUrl = window.location.origin
    const code = customAlias || shortCode
    const url = `${baseUrl}/${code}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  const handleViewQR = async (id: string) => {
    try {
      const response = await fetch(`/api/shortlinks/${id}/qr`)
      const data = await response.json()
      
      if (response.ok) {
        // Open QR code in new window
        const win = window.open('', '_blank')
        if (win) {
          win.document.write(`
            <html>
              <head><title>QR Code</title></head>
              <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;">
                <h2>QR Code</h2>
                <img src="${data.qrCode}" alt="QR Code" />
                <p>${data.shortUrl}</p>
                <button onclick="window.print()">Print</button>
              </body>
            </html>
          `)
        }
      }
    } catch (error) {
      console.error('Failed to generate QR code:', error)
    }
  }

  const filteredLinks = shortlinks.filter(link => {
    const query = searchQuery.toLowerCase()
    return (
      link.originalUrl.toLowerCase().includes(query) ||
      link.shortCode.toLowerCase().includes(query) ||
      link.customAlias?.toLowerCase().includes(query) ||
      link.description?.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Short Links
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your shortened URLs
          </p>
        </div>
        <CreateShortlinkDialog onSuccess={fetchShortlinks} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Short Links</CardTitle>
              <CardDescription>{shortlinks.length} total links</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search links..."
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
          ) : filteredLinks.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No links found matching your search' : 'No short links yet. Create your first one!'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Short Code</TableHead>
                    <TableHead>Original URL</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinks.map((link) => {
                    const code = link.customAlias || link.shortCode
                    const shortUrl = `${window.location.origin}/${code}`
                    const isExpired = link.expiresAt && new Date() > new Date(link.expiresAt)
                    
                    return (
                      <TableRow key={link.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <code className="text-blue-600 dark:text-blue-400">/{code}</code>
                            {link.customAlias && (
                              <Badge variant="secondary" className="text-xs">Custom</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={link.originalUrl}>
                          {link.originalUrl}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <BarChart className="h-3 w-3 text-gray-500" />
                            {link.clicks}
                          </div>
                        </TableCell>
                        <TableCell>
                          {isExpired ? (
                            <Badge variant="destructive">Expired</Badge>
                          ) : link.isActive ? (
                            <Badge variant="default" className="bg-green-600">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(link.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(link.shortCode, link.customAlias)}
                              title="Copy link"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(shortUrl, '_blank')}
                              title="Open link"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewQR(link.id)}
                              title="View QR code"
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(link.id)}
                              title="Delete link"
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
