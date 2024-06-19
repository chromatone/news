import { defineCronHandler } from '#nuxt/cron'
import { createDirectus, createItem, readItems, rest, staticToken, readSingleton } from '@directus/sdk'
import nodemailer from 'nodemailer'
import { useCompiler } from '#vue-email'

const title = 'announcement'

export default defineCronHandler('hourly', async () => {

  const config = useRuntimeConfig()
  const db = createDirectus(config.usersDbDomain).with(rest()).with(staticToken(config.usersDbToken))

  const users = await db.request(readItems('users', {
    fields: ['*', 'sends.*'],
    limit: 10,
    sort: ['-date_created'],
    filter: {
      sends: {
        _none: {
          title: {
            _eq: title
          }
        }
      }
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


  for (let user of users) {
    const template = await useCompiler('tutor.vue', {
      props: {
        name: user?.name,
      }
    })

    const options = {
      from: 'bot@chromatone.center',
      to: user?.email,
      subject: 'Chromatone Tutorship starting',
      html: template.html,
      headers: {
        'Precedence': 'bulk',
        'List-Unsubscribe': `<${config.public.appDomain}/unsubscribe_address?email=${user?.email}>`,
      },
    }

    await transporter.sendMail(options)

    await db.request(createItem('sends', {
      user: user.id,
      title
    }))

    console.log(`Sent ${title} to ${user?.email}`)

    await delayPromise(3000 + Math.random() * 10000);
  }

}, { runOnInit: true })


const delayPromise = (ms) => new Promise(resolve => setTimeout(resolve, ms));