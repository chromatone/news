import { defineCronHandler } from '#nuxt/cron'
import { createDirectus, createItem, readItems, rest, staticToken } from '@directus/sdk'
import nodemailer from 'nodemailer'
import { useCompiler } from '#vue-email'

export default defineCronHandler('hourly', async () => {

  const config = useRuntimeConfig()
  const db = createDirectus(config.public.dbUrl).with(rest()).with(staticToken(config.apiToken))

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

  const transporter = nodemailer.createTransport({
    host: config.emailSmtpHost,
    port: config.emailSmtpPort,
    secure: config.emailSmtpSecure,
    auth: {
      user: config.emailSmtpUser,
      pass: config.emailSmtpPassword,
    },
  })

  const members = await db.request(readItems('members', {
    fields: ['id', 'user.email', 'user.first_name', 'user.last_name', 'newsletter_issues.*'],
    filter: {
      newsletter: true,
    }
  }))

  for (let issue of issues) {

    const recipients = members.filter(member => !issue.recipients.map(l => l.members_id).includes(member.id))

    for (let recipient of recipients) {

      const template = await useCompiler('news.vue', {
        props: {
          name: recipient?.user?.first_name + ' ' + recipient?.user?.last_name,
          title: issue?.title,
          newsletter: issue?.newsletter,
          content: issue?.content,
          news: issue?.news
        }
      })

      const options = {
        from: issue?.newsletter?.from,
        to: recipient.user?.email,
        subject: issue?.newsletter?.title + ': ' + issue.title,
        html: template.html,
        headers: {
          'Precedence': 'bulk',
          'List-Unsubscribe': `<${config.public.appDomain}/unsubscribe?id=${recipient?.id}>`, // Use unsubscribe URL from request body
        },
      }

      await transporter.sendMail(options)

      await db.request(createItem('newsletter_recipients', {
        newsletter_issues_id: issue.id,
        members_id: recipient.id
      }))

      console.log(`Sent ${issue?.title} to ${recipient?.user?.email}`)

      await delayPromise(3000 + Math.random() * 10000);
    }
  }

}, { runOnInit: true })


const delayPromise = (ms) => new Promise(resolve => setTimeout(resolve, ms));