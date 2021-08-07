import {
  createGraphQLHandler,
  makeMergedSchema,
  makeServices,
} from '@redwoodjs/api'

import schemas from 'src/graphql/**/*.{js,ts}'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import services from 'src/services/**/*.{js,ts}'

import cookie from 'cookie'

export const handler = createGraphQLHandler({
  loggerConfig: { logger, options: {} },
  schema: makeMergedSchema({
    schemas,
    services: makeServices({ services }),
  }),
  context: async ({ event, context }) => {
    if (event.headers?.cookie) {
      const cookies = cookie.parse(event.headers.cookie)

      if (cookies.token) {
        const token = await db.token.findUnique({
          where: {
            token: cookies.token,
          },
          include: {
            user: true,
          },
        })

        if (token) {
          context.token = token
        }
      }
    }
  },
  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
  },
})
