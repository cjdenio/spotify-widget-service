import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.TokenCreateArgs>({
  token: {
    one: {
      token: 'String763719',
      user: {
        create: {
          email: 'String3434181',
          spotifyToken: 'String',
          spotifyRefreshToken: 'String',
        },
      },
    },
    two: {
      token: 'String287775',
      user: {
        create: {
          email: 'String2947114',
          spotifyToken: 'String',
          spotifyRefreshToken: 'String',
        },
      },
    },
  },
})

export type StandardScenario = typeof standard
