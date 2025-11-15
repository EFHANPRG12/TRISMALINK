'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

interface CreateListDialogProps {
  onSuccess?: () => void
}

export function CreateListDialog({ onSuccess }: CreateListDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    profileImageUrl: '',
    theme: 'light',
    backgroundType: 'solid',
    backgroundValue: '#f3f4f6',
    buttonStyle: 'rounded',
    textColor: '#111827',
    buttonColor: '#3b82f6',
    fontFamily: 'Inter',
    layout: 'center'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create list')
        toast.error(data.error || 'Failed to create list')
      } else {
        // Reset form
        setFormData({
          title: '',
          slug: '',
          description: '',
          profileImageUrl: '',
          theme: 'light',
          backgroundType: 'solid',
          backgroundValue: '#f3f4f6',
          buttonStyle: 'rounded',
          textColor: '#111827',
          buttonColor: '#3b82f6',
          fontFamily: 'Inter',
          layout: 'center'
        })
        setOpen(false)
        toast.success('Link list created successfully!')
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
          Create List
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Link-in-Bio Page</DialogTitle>
            <DialogDescription>
              Create a beautiful page to showcase all your links
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="title">Page Title *</Label>
              <Input
                id="title"
                placeholder="My Awesome Links"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Username/Slug *</Label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">/u/</span>
                <Input
                  id="slug"
                  placeholder="username"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  disabled={isLoading}
                  pattern="[a-zA-Z0-9_-]+"
                  title="Only letters, numbers, hyphens and underscores"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your public URL: /u/{formData.slug || 'username'}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Welcome to my page!"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isLoading}
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profileImageUrl">Profile Image URL</Label>
              <Input
                id="profileImageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.profileImageUrl}
                onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="backgroundType">Background Type</Label>
                <Select 
                  value={formData.backgroundType} 
                  onValueChange={(value) => setFormData({ ...formData, backgroundType: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger id="backgroundType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid Color</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="image">Image URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="backgroundValue">
                  {formData.backgroundType === 'solid' ? 'Background Color' : 
                   formData.backgroundType === 'gradient' ? 'Gradient CSS' : 
                   'Image URL'}
                </Label>
                {formData.backgroundType === 'solid' ? (
                  <Input
                    id="backgroundValue"
                    type="color"
                    value={formData.backgroundValue}
                    onChange={(e) => setFormData({ ...formData, backgroundValue: e.target.value })}
                    disabled={isLoading}
                  />
                ) : (
                  <Input
                    id="backgroundValue"
                    type="text"
                    placeholder={formData.backgroundType === 'gradient' ? 'linear-gradient(...)' : 'https://...'}
                    value={formData.backgroundValue}
                    onChange={(e) => setFormData({ ...formData, backgroundValue: e.target.value })}
                    disabled={isLoading}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="textColor">Text Color</Label>
                <Input
                  id="textColor"
                  type="color"
                  value={formData.textColor}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="buttonColor">Button Color</Label>
              <Input
                id="buttonColor"
                type="color"
                value={formData.buttonColor}
                onChange={(e) => setFormData({ ...formData, buttonColor: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fontFamily">Font Family</Label>
              <Select
                value={formData.fontFamily}
                onValueChange={(value) => setFormData({ ...formData, fontFamily: value })}
                disabled={isLoading}
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

            <div className="grid gap-2">
              <Label htmlFor="buttonStyle">Button Style</Label>
              <Select
                value={formData.buttonStyle}
                onValueChange={(value) => setFormData({ ...formData, buttonStyle: value })}
                disabled={isLoading}
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

            <div className="grid gap-2">
              <Label htmlFor="layout">Layout</Label>
              <Select
                value={formData.layout}
                onValueChange={(value) => setFormData({ ...formData, layout: value })}
                disabled={isLoading}
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create List'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
