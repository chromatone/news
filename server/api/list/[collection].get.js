import { createDirectus, readItems, rest, staticToken } from '@directus/sdk'

const collections = {
  members: ['members', {
    // fields: ['*', 'user.*',]
  }],
  newsletters: [
    'newsletters',
    {
      fields: ['title', 'description', {
        issues: ['title', 'description', {
          news: ['title', 'description']
        }]
      }]
    }
  ]

}

let db

export default defineEventHandler(async event => {

  const collection = getRouterParam(event, 'collection')
  const config = useRuntimeConfig()

  db = db || createDirectus(config.public.dbUrl).with(rest()).with(staticToken(config.apiToken))

  console.log('reading', collection)

  if (collections[collection]) {
    try {
      return await db.request(readItems(collections[collection][0], collections[collection][1]))
    } catch (e) {
      console.log(e)
    }

  }

  console.log('No ' + collection + ' collection')
  return []

})