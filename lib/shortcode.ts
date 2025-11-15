import { prisma } from './prisma'

const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export async function generateShortCode(length: number = 6): Promise<string> {
  let code = ''
  let exists = true

  while (exists) {
    code = ''
    for (let i = 0; i < length; i++) {
      code += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
    }

    const existing = await prisma.shortlink.findFirst({
      where: {
        OR: [
          { shortCode: code },
          { customAlias: code }
        ]
      }
    })

    exists = !!existing
  }

  return code
}

export function isValidShortCode(code: string): boolean {
  return /^[a-zA-Z0-9-_]{4,20}$/.test(code)
}
