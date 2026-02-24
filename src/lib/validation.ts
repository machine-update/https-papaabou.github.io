import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
})

export const userCreateSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'EDITOR']),
})

export const userUpdateSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).optional().or(z.literal('')),
  role: z.enum(['ADMIN', 'EDITOR']),
})

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers and dashes'),
  description: z.string().trim().min(10).max(1200),
  image: z.string().trim().min(1),
  category: z.string().trim().min(2).max(120),
})

export const serviceSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(1200),
})

export const prestationSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(1200),
})

export const partenaireSchema = z.object({
  name: z.string().trim().min(2).max(120),
  logo: z.string().trim().max(2048).optional().or(z.literal('')),
  website: z.string().trim().max(2048).optional().or(z.literal('')),
  country: z.string().trim().max(120).optional().or(z.literal('')),
  region: z.string().trim().max(120).optional().or(z.literal('')),
  revenueAmount: z.number().int().min(0).optional().default(0),
  riskScore: z.number().min(0).max(100).optional().default(0),
  isActive: z.boolean().optional().default(true),
})

export const productionSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers and dashes'),
  description: z.string().trim().min(10).max(1200),
  image: z.string().trim().min(1),
  category: z.string().trim().min(2).max(120),
  youtubeUrl: z.string().trim().url().optional().or(z.literal('')),
  country: z.string().trim().max(120).optional().or(z.literal('')),
  region: z.string().trim().max(120).optional().or(z.literal('')),
  viewCount: z.number().int().min(0).optional().default(0),
  watchTimeMinutes: z.number().int().min(0).optional().default(0),
  abandonmentRate: z.number().min(0).max(100).optional().default(0),
  revenueAmount: z.number().int().min(0).optional().default(0),
  costAmount: z.number().int().min(0).optional().default(0),
  status: z.enum(['DRAFT', 'IN_PRODUCTION', 'COMPLETED']).optional().default('DRAFT'),
  isActive: z.boolean().optional().default(true),
  tags: z.array(z.string().trim().min(1).max(60)).optional().default([]),
  artisteIds: z.array(z.string().uuid()).optional().default([]),
  partenaireIds: z.array(z.string().uuid()).optional().default([]),
})

export const artisteSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers and dashes'),
  role: z.string().trim().min(2).max(120),
  country: z.string().trim().max(120).optional().or(z.literal('')),
  region: z.string().trim().max(120).optional().or(z.literal('')),
  performanceScore: z.number().min(0).max(100).optional().default(0),
  shortBio: z.string().trim().max(280).optional().or(z.literal('')),
  bio: z.string().trim().min(10).max(2000),
  photo: z.string().trim().min(1),
  stats: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(80),
        value: z.string().trim().min(1).max(120),
      }),
    )
    .optional()
    .default([]),
  highlights: z.array(z.string().trim().min(1).max(240)).optional().default([]),
  bookingFormats: z.array(z.string().trim().min(1).max(120)).optional().default([]),
  socials: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(40),
        url: z.string().trim().url(),
      }),
    )
    .optional()
    .default([]),
  featured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
})
