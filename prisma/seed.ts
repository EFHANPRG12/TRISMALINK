import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test user
  const hashedPassword = await bcrypt.hash('Password123!', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
    },
  })

  console.log('✅ Test user created:')
  console.log('   Email: test@example.com')
  console.log('   Password: Password123!')
  console.log('   Username:', user.username)

  // Create sample shortlinks (use upsert to avoid duplicates)
  const shortlink1 = await prisma.shortlink.upsert({
    where: { shortCode: 'demo1' },
    update: {},
    create: {
      userId: user.id,
      shortCode: 'demo1',
      originalUrl: 'https://github.com',
      description: 'GitHub - Where the world builds software',
      tags: 'dev,github',
      isActive: true,
      clicks: 0
    }
  })

  const shortlink2 = await prisma.shortlink.upsert({
    where: { shortCode: 'abc123' },
    update: {},
    create: {
      userId: user.id,
      shortCode: 'abc123',
      originalUrl: 'https://nextjs.org',
      customAlias: 'nextjs',
      description: 'Next.js - The React Framework',
      tags: 'web,react,nextjs',
      isActive: true,
      clicks: 5
    }
  })

  console.log('✅ Sample shortlinks created:')
  console.log('   /' + shortlink1.shortCode, '→', shortlink1.originalUrl)
  console.log('   /' + (shortlink2.customAlias || shortlink2.shortCode), '→', shortlink2.originalUrl)

  // Create sample linklist (use upsert)
  const linklist = await prisma.linkList.upsert({
    where: { slug: 'testuser' },
    update: {},
    create: {
      userId: user.id,
      title: 'Test User Links',
      slug: 'testuser',
      description: 'Find all my important links here!',
      profileImageUrl: null,
      theme: 'light',
      backgroundType: 'solid',
      backgroundValue: '#f3f4f6',
      textColor: '#111827',
      buttonColor: '#3b82f6',
      buttonStyle: 'rounded',
      fontFamily: 'Inter',
      layout: 'center'
    }
  })

  // Check if items already exist
  const existingItems = await prisma.listItem.findMany({
    where: { listId: linklist.id }
  })

  if (existingItems.length === 0) {
    // Create sample list items only if none exist
    await prisma.listItem.createMany({
      data: [
        {
          listId: linklist.id,
          title: 'GitHub Profile',
          url: 'https://github.com',
          icon: '💻',
          order: 0,
          clicks: 0,
          isVisible: true
        },
        {
          listId: linklist.id,
          title: 'Portfolio Website',
          url: 'https://example.com',
          icon: '🌐',
          order: 1,
          clicks: 0,
          isVisible: true
        },
        {
          listId: linklist.id,
          title: 'Twitter / X',
          url: 'https://twitter.com',
          icon: '🐦',
          order: 2,
          clicks: 0,
          isVisible: true
        }
      ]
    })
  }

  console.log('✅ Sample linklist created:')
  console.log('   /u/' + linklist.slug, '→', linklist.title)
  console.log('   ' + (existingItems.length || 3) + ' links')

  console.log('🎉 Seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
