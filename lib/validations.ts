import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const shortlinkSchema = z.object({
  originalUrl: z.string().url(),
  customAlias: z.string().min(4).max(100).regex(/^[a-zA-Z0-9-_]+$/).optional(),
  description: z.string().max(500).optional(),
  tags: z.array(z.string()).optional(),
  expiresAt: z.string().datetime().optional(),
})

export const listlinkSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(3).max(100).regex(/^[a-zA-Z0-9-_]+$/),
  description: z.string().max(500).optional().nullable(),
  profileImageUrl: z.union([z.string().url(), z.literal('')]).optional().nullable(),
  theme: z.enum(['light', 'dark', 'custom']).default('light'),
  backgroundType: z.enum(['solid', 'gradient', 'image']).default('solid'),
  backgroundValue: z.string().optional().nullable(),
  buttonStyle: z.enum(['rounded', 'square', 'pill', 'soft']).default('rounded'),
  buttonColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#000000'),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#ffffff'),
  fontFamily: z.enum(['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Raleway', 'Ubuntu']).default('Inter'),
  layout: z.enum(['center', 'left', 'right']).default('center'),
  customCss: z.string().max(5000).optional().nullable(),
})

export const listItemSchema = z.object({
  title: z.string().min(1).max(255),
  url: z.string().url(),
  icon: z.string().optional(),
  isVisible: z.boolean().optional(),
})
