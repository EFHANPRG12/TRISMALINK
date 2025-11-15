'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Trash2, GripVertical, Eye, EyeOff, ExternalLink } from 'lucide-react'
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
  backgroundType: string
  backgroundValue: string | null
  buttonStyle: string
  buttonColor: string
  textColor: string
  fontFamily: string
  layout: string
  customCss: string | null
  items: ListItem[]
}

export default function EditListPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [list, setList] = useState<LinkList | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [showItemForm, setShowItemForm] = useState(false)
  const [itemFormData, setItemFormData] = useState({
    title: '',
    url: '',
    icon: ''
  })
  const [multipleItems, setMultipleItems] = useState([
    { title: '', url: '', icon: '' }
  ])
  const [isMultipleMode, setIsMultipleMode] = useState(false)

  useEffect(() => {
    if (id) {
      fetchList()
    }
  }, [id])

  const fetchList = async () => {
    if (!id) return
    
    try {
      const response = await fetch(`/api/lists/${id}`)
      const data = await response.json()
      if (response.ok) {
        setList(data.list)
      } else {
        setError(data.error || 'Failed to fetch list')
      }
    } catch (error) {
      console.error('Failed to fetch list:', error)
      setError('Failed to fetch list')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!list) return

    setIsSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/lists/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: list.title,
          slug: list.slug,
          description: list.description,
          profileImageUrl: list.profileImageUrl,
          theme: list.theme,
          backgroundType: list.backgroundType,
          backgroundValue: list.backgroundValue,
          buttonStyle: list.buttonStyle,
          buttonColor: list.buttonColor,
          textColor: list.textColor,
          fontFamily: list.fontFamily,
          layout: list.layout,
          customCss: list.customCss
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to update list')
        toast.error(data.error || 'Failed to update list')
      } else {
        toast.success('Settings saved successfully!')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch(`/api/lists/${id}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemFormData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to add item')
        toast.error(data.error || 'Failed to add item')
      } else {
        setItemFormData({ title: '', url: '', icon: '' })
        setShowItemForm(false)
        toast.success('Item added successfully!')
        fetchList() // Refresh list
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      toast.error('An error occurred. Please try again.')
    }
  }

  const handleAddMultipleItems = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Filter out empty items
    const validItems = multipleItems.filter(item => item.title.trim() && item.url.trim())
    
    if (validItems.length === 0) {
      toast.error('Please add at least one valid item')
      return
    }

    try {
      // Add items one by one
      const promises = validItems.map(item => 
        fetch(`/api/lists/${id}/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        })
      )

      const responses = await Promise.all(promises)
      const failedCount = responses.filter(r => !r.ok).length

      if (failedCount === 0) {
        setMultipleItems([{ title: '', url: '', icon: '' }])
        setShowItemForm(false)
        setIsMultipleMode(false)
        toast.success(`${validItems.length} items added successfully!`)
        fetchList() // Refresh list
      } else {
        toast.error(`${failedCount} items failed to add`)
        fetchList() // Refresh list to show what was added
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      toast.error('An error occurred. Please try again.')
    }
  }

  const addMoreItemFields = () => {
    setMultipleItems([...multipleItems, { title: '', url: '', icon: '' }])
  }

  const removeItemField = (index: number) => {
    if (multipleItems.length > 1) {
      setMultipleItems(multipleItems.filter((_, i) => i !== index))
    }
  }

  const updateItemField = (index: number, field: string, value: string) => {
    const updated = [...multipleItems]
    updated[index] = { ...updated[index], [field]: value }
    setMultipleItems(updated)
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/list-items/${itemId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Item deleted successfully')
        fetchList() // Refresh list
      } else {
        toast.error('Failed to delete item')
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
      toast.error('An error occurred while deleting')
    }
  }

  const handleToggleVisibility = async (item: ListItem) => {
    try {
      const response = await fetch(`/api/list-items/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isVisible: !item.isVisible
        }),
      })

      if (response.ok) {
        fetchList() // Refresh list
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!list) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">List not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/lists')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit: {list.title}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Public URL: <a href={`/u/${list.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">/u/{list.slug}</a>
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Settings Panel */}
        <Card>
          <CardHeader>
            <CardTitle>List Settings</CardTitle>
            <CardDescription>Configure your link-in-bio page</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={list.title}
                  onChange={(e) => setList({ ...list, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Custom URL *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">/u/</span>
                  <Input
                    id="slug"
                    value={list.slug}
                    onChange={(e) => setList({ ...list, slug: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={list.description || ''}
                  onChange={(e) => setList({ ...list, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileImageUrl">Profile Image URL</Label>
                <Input
                  id="profileImageUrl"
                  type="url"
                  value={list.profileImageUrl || ''}
                  onChange={(e) => setList({ ...list, profileImageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={list.theme}
                    onValueChange={(value) => setList({ ...list, theme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backgroundType">Background Type</Label>
                  <Select
                    value={list.backgroundType}
                    onValueChange={(value) => setList({ ...list, backgroundType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backgroundValue">Background Value</Label>
                <Input
                  id="backgroundValue"
                  value={list.backgroundValue || ''}
                  onChange={(e) => setList({ ...list, backgroundValue: e.target.value })}
                  placeholder="#f3f4f6 or url(...)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buttonColor">Button Color</Label>
                  <Input
                    id="buttonColor"
                    type="color"
                    value={list.buttonColor}
                    onChange={(e) => setList({ ...list, buttonColor: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <Input
                    id="textColor"
                    type="color"
                    value={list.textColor}
                    onChange={(e) => setList({ ...list, textColor: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonStyle">Button Style</Label>
                <Select
                  value={list.buttonStyle}
                  onValueChange={(value) => setList({ ...list, buttonStyle: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="pill">Pill (Fully Rounded)</SelectItem>
                    <SelectItem value="soft">Soft (Slightly Rounded)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select
                  value={list.fontFamily}
                  onValueChange={(value) => setList({ ...list, fontFamily: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Raleway">Raleway</SelectItem>
                    <SelectItem value="Ubuntu">Ubuntu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="layout">Layout</Label>
                <Select
                  value={list.layout}
                  onValueChange={(value) => setList({ ...list, layout: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customCss">Custom CSS (Advanced)</Label>
                <Textarea
                  id="customCss"
                  value={list.customCss || ''}
                  onChange={(e) => setList({ ...list, customCss: e.target.value })}
                  rows={6}
                  placeholder=".custom-button { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }"
                  className="font-mono text-xs"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add custom CSS to further style your page
                </p>
              </div>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Items Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
            <CardDescription>Manage links on your page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showItemForm ? (
              <div className="flex gap-2">
                <Button onClick={() => {
                  setShowItemForm(true)
                  setIsMultipleMode(false)
                }} className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Single Link
                </Button>
                <Button onClick={() => {
                  setShowItemForm(true)
                  setIsMultipleMode(true)
                }} variant="outline" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Multiple Links
                </Button>
              </div>
            ) : !isMultipleMode ? (
              <form onSubmit={handleAddItem} className="space-y-3 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="itemTitle">Title *</Label>
                  <Input
                    id="itemTitle"
                    value={itemFormData.title}
                    onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemUrl">URL *</Label>
                  <Input
                    id="itemUrl"
                    type="url"
                    value={itemFormData.url}
                    onChange={(e) => setItemFormData({ ...itemFormData, url: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemIcon">Icon (emoji)</Label>
                  <Input
                    id="itemIcon"
                    value={itemFormData.icon}
                    onChange={(e) => setItemFormData({ ...itemFormData, icon: e.target.value })}
                    placeholder="🔗"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" size="sm">Add</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => {
                    setShowItemForm(false)
                    setItemFormData({ title: '', url: '', icon: '' })
                  }}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAddMultipleItems} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-base font-semibold">Add Multiple Links</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addMoreItemFields}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add More
                  </Button>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {multipleItems.map((item, index) => (
                    <div key={index} className="space-y-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Link {index + 1}</Label>
                        {multipleItems.length > 1 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItemField(index)}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Input
                          placeholder="Title *"
                          value={item.title}
                          onChange={(e) => updateItemField(index, 'title', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Input
                          type="url"
                          placeholder="URL *"
                          value={item.url}
                          onChange={(e) => updateItemField(index, 'url', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Input
                          placeholder="Icon (emoji)"
                          value={item.icon}
                          onChange={(e) => updateItemField(index, 'icon', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" size="sm">Add All Links</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => {
                    setShowItemForm(false)
                    setMultipleItems([{ title: '', url: '', icon: '' }])
                    setIsMultipleMode(false)
                  }}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Items List */}
            <div className="space-y-2">
              {list.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                  {item.icon && <span className="text-xl">{item.icon}</span>}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 truncate">{item.url}</p>
                    <p className="text-xs text-gray-400">{item.clicks} clicks</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleVisibility(item)}
                    >
                      {item.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}

              {list.items.length === 0 && !showItemForm && (
                <p className="text-center text-sm text-gray-500 py-8">
                  No links yet. Click "Add Link" to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Button */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Preview Your Page</h3>
              <p className="text-sm text-gray-500">See how your page looks to visitors</p>
            </div>
            <Button asChild>
              <a href={`/u/${list.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Preview
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
