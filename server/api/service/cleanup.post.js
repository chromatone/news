import { createDirectus, readItems, rest, staticToken, updateItems } from '@directus/sdk'


let db

export default defineEventHandler(async event => {

  const config = useRuntimeConfig()

  db = db || createDirectus(config.usersDbDomain).with(rest()).with(staticToken(config.usersDbToken))

  try {
    let users = await db.request(readItems('users', {
      fields: ['*', 'sends.*'],
      sort: ['date_created'],
      limit: 10000,
      filter: {
        status: {
          _nin: ['spam', 'archived', 'unsubscribed']
        },
      }
    }))

    console.log('Users: ', users.length)

    const duplicates = getDuplicateIds(users).map(u => u.id)

    console.log('Duplicates: ', duplicates.length)

    if (duplicates.length > 0) {
      await db.request(updateItems('users', duplicates, { status: 'archived' }))
    }

    console.log('Archived.')


    function getDuplicateIds(data) {
      const obj = {}
      const filtered = data.filter(
        (item, pos, self) => {
          if (obj[item.email]) {
            return true
          }
          obj[item.email] = true
          return false
        })
      return filtered

    }

    return duplicates
  } catch (e) {
    console.log(e)
  }



})