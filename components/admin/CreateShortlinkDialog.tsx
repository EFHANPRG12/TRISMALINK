'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

interface CreateShortlinkDialogProps {
  onSuccess?: () => void
}

export function CreateShortlinkDialog({ onSuccess }: CreateShortlinkDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    description: '',
    tags: '',
    expiresAt: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Process tags: convert comma-separated string to array
      const tagsArray = formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : undefined

      // Process expiresAt: convert to ISO datetime format if provided
      const expiresAtISO = formData.expiresAt 
        ? new Date(formData.expiresAt).toISOString()
        : undefined

      const response = await fetch('/api/shortlinks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl: formData.originalUrl,
          customAlias: formData.customAlias || undefined,
          description: formData.description || undefined,
          tags: tagsArray,
          expiresAt: expiresAtISO
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create shortlink')
        toast.error(data.error || 'Failed to create shortlink')
      } else {
        // Reset form
        setFormData({
          originalUrl: '',
          customAlias: '',
          description: '',
          tags: '',
          expiresAt: ''
        })
        setOpen(false)
        toast.success('Shortlink created successfully!')
        onSuccess?.()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Short Link</DialogTitle>
            <DialogDescription>
              Create a new shortened URL with optional custom alias
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="originalUrl">Original URL *</Label>
              <Input
                id="originalUrl"
                type="url"
                placeholder="https://example.com/very/long/url"
                value={formData.originalUrl}
                onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="customAlias">Custom Alias (optional)</Label>
              <Input
                id="customAlias"
                type="text"
                placeholder="my-custom-link"
                value={formData.customAlias}
                onChange={(e) => setFormData({ ...formData, customAlias: e.target.value })}
                disabled={isLoading}
                pattern="[a-zA-Z0-9_-]+"
                title="Only letters, numbers, hyphens and underscores"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Leave empty for auto-generated code
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Description for this link"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <Input
                id="tags"
                type="text"
                placeholder="marketing, social-media"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Comma-separated tags
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expiresAt">Expiry Date (optional)</Label>
              <Input
                id="expiresAt"
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
