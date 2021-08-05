import type { BeforeResolverSpecType } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
// import { requireAuth } from 'src/lib/auth'

// Used when the environment variable REDWOOD_SECURE_SERVICES=1
export const beforeResolver = (_rules: BeforeResolverSpecType) => {
  // rules.add(requireAuth)
  logger.info('HI THERE')
}

export const tokens = () => {
  return db.token.findMany()
}

export const generateToken = () => {
  return (
    Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
  )
}
