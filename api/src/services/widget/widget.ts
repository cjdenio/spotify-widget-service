import { db } from 'src/lib/db'
import Spotify from 'spotify-web-api-node'
import { DateTime } from 'luxon'
import { logger } from 'src/lib/logger'

interface Widget {
  isPlaying: boolean
  song?: string
  songLink?: string
  artist?: string
}

export const fetchWidget = async (user: {
  id: number
  spotifyToken: string
  spotifyRefreshToken: string
  spotifyTokenExpiration?: Date
}): Promise<Widget | undefined> => {
  const spotify = new Spotify({
    accessToken: user.spotifyToken,
    refreshToken: user.spotifyRefreshToken,
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
