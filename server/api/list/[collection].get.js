import { createDirectus, readItems, rest, staticToken } from '@directus/sdk'

const collections = {
  members: ['members', {
    fields: ['*', 'user.*',]
  }],
  team: ['members', {
    fields: ['*', 'user.*'],
    filter: {
      team: {
        _nnull: true
      }
    }
  }],
  students: ['members', {
    fields: ['*', 'user.*'],
    filter: {
      student: {
        _nnull: true
      }
    }
  }],
  courses: ['courses', {
    fields: ['*', 'program.title', 'program.slug']
  }],
  crafts: [
    'crafts',
    {
      sort: ['sort'],
      fields: ['*']
    }
  ],
  skills: [
    'skills',
    {
      sort: ['sort'],
      fields: ['*']
    }
  ],
  programs: [
    'programs',
    {
      sort: ['sort'],
      fields: ['slug', 'color', 'projects', 'title', 'description', 'cover', 'courses']
    }],
  projects: [
    'projects',
    {
      sort: ['sort'],
      fields: ['slug', 'color', 'title', 'description', 'cover', 'courses', 'events', {
        program: ['title', 'slug']
      }]
    }],
  docs: [
    'academy_docs',
    {
      sort: ['sort'],
      fields: ['*']
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

  db = db || createDirectus(config.public.dbUrl).with(rest()).with(staticToken(config.dbManagerKey))

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