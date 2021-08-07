import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      email: 'String2645783',
      spotifyToken: 'String',
      spotifyRefreshToken: 'String',
    },
    two: {
      email: 'String5027076',
      spotifyToken: 'String',
      spotifyRefreshToken: 'String',
    },
  },
})

export type StandardScenario = typeof standard
