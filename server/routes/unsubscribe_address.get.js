import { createDirectus, rest, staticToken, updateItem, readItems } from "@directus/sdk"
import { z } from 'zod';

export default defineEventHandler(async event => {
  const query = getQuery(event)
  const { success, data: email } = z.string().email().safeParse(query.email)

  if (!success) return sendRedirect(event, '/unsubscribe_fail')

  console.log(success, email)
  const config = useRuntimeConfig()
  const db = createDirectus(config.usersDbDomain).with(rest()).with(staticToken(config.usersDbToken))

  try {
    const ids = await db.request(readItems('users', {
      filter: {
        email: {
          _eq: email
        }
      }
    }))

    await db.request(updateItem('users', ids[0].id, {
      status: 'unsubscribed'
    }))

    return sendRedirect(event, `/unsubscribed/`)
  } catch (e) {
    return sendRedirect(event, '/unsubscribe_fail')
  }
})