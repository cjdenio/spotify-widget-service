import type { BeforeResolverSpecType } from '@redwoodjs/api'

import { requireAuth } from 'src/lib/auth'
import { context } from '@redwoodjs/api'
import { db } from 'src/lib/db'
import { nanoid } from 'nanoid'
import { fetchWidget } from '../widget/widget'

// Used when the environment variable REDWOOD_SECURE_SERVICES=1
export const beforeResolver = (rules: BeforeResolverSpecType) => {
  rules.add(requireAuth)
}

export const viewer = async () => {
  const token = context.token as { user: unknown }

  if (token) {
    return token.user
  } else {
    return null
  }
}

export const shuffleWidgetToken = async () => {
  const token = context.token as { user: { id: number } }

  if (token) {
    const widgetToken = nanoid(5)

    await db.user.update({
      where: {
        id: token.user.id,
      },
      data: {
        widgetToken,
      },
    })

    return widgetToken
  } else {
    return null
  }
}

export const User = {
  async widget(_args, { root }) {
    return await fetchWidget(root)
  },
}
