'use client'

import { ExternalLink } from 'lucide-react'

interface ClickableListItemProps {
  item: {
    id: string
    title: string
    url: string
    icon: string | null
  }
  buttonColor: string
  borderRadius?: string
}

export function ClickableListItem({ item, buttonColor, borderRadius = '12px' }: ClickableListItemProps) {
  const handleClick = async () => {
    // Track click analytics
    try {
      await fetch(`/api/track-click/${item.id}`, { method: 'POST' })
    } catch (error) {
      console.error('Failed to track click:', error)
    }
  }

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full p-4 transition-all hover:scale-105 hover:shadow-lg"
      style={{
        backgroundColor: buttonColor,
        color: '#ffffff',
        borderRadius: borderRadius
      }}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {item.icon && (
            <span className="text-2xl">{item.icon}</span>
          )}
          <span className="font-medium text-lg">{item.title}</span>
        </div>
        <ExternalLink className="h-5 w-5" />
      </div>
    </a>
  )
}
