import { defineCronHandler } from '#nuxt/cron'
import { createDirectus, createItem, readItems, rest, staticToken } from '@directus/sdk'
import nodemailer from 'nodemailer'
import { useCompiler } from '#vue-email'

let db

export default defineCronHandler('everyMinute', async () => {

  const config = useRuntimeConfig()
  db = db || createDirectus(config.public.dbUrl).with(rest()).with(staticToken(config.dbManagerKey))

  const issues = await db.request(readItems('newsletter_issues', {
    fields: ['id', 'title', 'description', 'content', 'recipients.members_id', 'newsletter.from', {
      newsletter: ['title', 'description', 'slug'],
      news: ['slug', 'title', 'description', 'link', 'content', 'program.slug'],
      recepients: ['*']
    }],
    filter: {
      status: {
        _eq: 'published'
      }
    }
  }))

  if (issues.length == 0) return console.log('no active newsletter issues')

  const members = await db.request(readItems('members', {
    fields: ['id', 'user.email'],
    filter: {
      newsletter: true
    }
  }))

  const transporter = nodemailer.createTransport({
    host: config.emailSmtpHost,
    port: config.emailSmtpPort,
    secure: config.emailSmtpSecure,
    auth: {
      user: config.emailSmtpUser,
      pass: config.emailSmtpPassword,
    },
  })

  issues.forEach(async issue => {

    const template = await useCompiler('news.vue', {
      props: {
        name: 'DEMO'
      }
    })

    const recipients = members.filter(m => !issue.recipients.map(l => l.members_id).includes(m.id)).slice(0, 2).forEach(async r => {
      const options = {
        from: issue?.newsletter?.from,
        to: r.user?.email,
        subject: issue.title,
        html: template.html,
        headers: {
          'Precedence': 'bulk',
          'List-Unsubscribe': `<${issue?.unsubscribeUrl}>`, // Use unsubscribe URL from request body
        },
      }

      setTimeout(async () => {
        await transporter.sendMail(options)
        await db.request(createItem('newsletter_recipients', {
          newsletter_issues_id: issue.id,
          members_id: r.id
        }))
        console.log('SENT')
      }, Math.random() * 1000 * 30)

    })

  })

}, { runOnInit: true })