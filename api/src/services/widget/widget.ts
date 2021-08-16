import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

import { DateTime } from 'luxon'
import Spotify from 'spotify-web-api-node'
import Redis from 'ioredis'

import { User } from '@prisma/client'

interface Widget {
  isPlaying: boolean
  song?: string
  songLink?: string
  artist?: string
}

export const fetchWidget = async (user: User): Promise<Widget> => {
  // Try to pull from the cache
  const redis = new Redis(process.env.REDIS_URL)

  const cached = await redis.get(`widget:${user.id}`)
  if (cached) {
    return JSON.parse(cached)
  }

  return await fetchWidgetWithoutCache(user)
}

export const fetchWidgetWithoutCache = async (
  user: User
): Promise<Widget | undefined> => {
  const spotify = new Spotify({
    accessToken: user.spotifyToken,
    refreshToken: user.spotifyRefreshToken,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  })

  if (
    DateTime.fromJSDate(user.spotifyTokenExpiration).diffNow('seconds')
      .seconds < 0
  ) {
    logger.info('Refreshing access token...')

    const newToken = await spotify.refreshAccessToken()

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        spotifyToken: newToken.body.access_token,
        spotifyRefreshToken: newToken.body.refresh_token,
        spotifyTokenExpiration: DateTime.now()
          .plus({ seconds: newToken.body.expires_in })
          .toJSDate(),
      },
    })

    spotify.setAccessToken(newToken.body.access_token)
  }

  const track = await spotify.getMyCurrentPlayingTrack()

  if (!track.body?.item) {
    return { isPlaying: false }
  }

  const item = track.body.item as SpotifyApi.TrackObjectFull

  return {
    isPlaying: !!track.body?.is_playing,
    song: item.name,
    songLink: item.external_urls.spotify,
    artist: item.artists[0].name,
  }
}

export const widget = async ({ token }) => {
  const user = await db.user.findUnique({
    where: {
      widgetToken: token,
    },
  })

  if (!user) {
    return null
  }

  return await fetchWidget(user)
}
