import type { APIGatewayEvent, Context } from 'aws-lambda'
import { db } from 'src/lib/db'
import Redis from 'ioredis'
import { fetchWidgetWithoutCache } from 'src/services/widget/widget'

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
  if (event.queryStringParameters.token !== process.env.CRON_TOKEN)
    return {
      statusCode: 401,
      body: 'nope',
    }

  const redis = new Redis(process.env.REDIS_URL)
  const users = await db.user.findMany()

  await Promise.all(
    users.map(async (user) => {
      const widget = await fetchWidgetWithoutCache(user)
      await redis.set(`widget:${user.id}`, JSON.stringify(widget))
    })
  )

  return {
    statusCode: 200,
    body: 'yay',
  }
}
