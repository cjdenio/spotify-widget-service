import type { APIGatewayEvent, Context } from 'aws-lambda'
import { db } from 'src/lib/db'
import Spotify from 'spotify-web-api-node'
import { generateToken } from 'src/services/tokens/tokens'

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */
export const handler = async (event: APIGatewayEvent, _context: Context) => {
  const code = event.queryStringParameters.code

  const spotify = new Spotify({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:8910/.redwood/functions/oauthCallback',
  })

  try {
    const { body } = await spotify.authorizationCodeGrant(code)

    spotify.setAccessToken(body.access_token)

    const {
      body: { email },
    } = await spotify.getMe()

    // Look for user
    let user = await db.user.findUnique({ where: { email } })

    if (user === null) {
      // Create user
      user = await db.user.create({
        data: {
          email,
          spotifyToken: body.access_token,
          spotifyRefreshToken: body.refresh_token,
        },
      })
    }

    const token = generateToken()

    await db.user.update({
      where: { id: user.id },
      data: {
        tokens: {
          create: {
            token,
          },
        },
      },
    })

    return {
      statusCode: 307,
      headers: {
        Location: '/',
        'Set-Cookie': `token=${token}; Max-Age=2592000`,
      },
      body: token,
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: 'Something went wrong :(  Please try again in a minute.',
    }
  }
}
