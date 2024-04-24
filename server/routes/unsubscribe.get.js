import { createDirectus, rest, staticToken, updateItem } from "@directus/sdk"
import { z } from 'zod';

export default defineEventHandler(async event => {
  const query = getQuery(event)
  const { success, data: id } = z.string().uuid().safeParse(query.id)

  if (!success) return sendRedirect(event, '/unsubscribe_fail')

  console.log(success, id)
  const config = useRuntimeConfig()
  const db = createDirectus(config.public.dbUrl).with(rest()).with(staticToken(config.apiToken))

  try {
    await db.request(updateItem('members', id, {
      newsletter: false
    }))

    return sendRedirect(event, `/unsubscribed/`)
  } catch (e) {
    return sendRedirect(event, '/unsubscribe_fail')
  }
})