import { defineCronHandler } from '#nuxt/cron'
import { createDirectus, createItem, readItems, rest, staticToken, readSingleton, readItem } from '@directus/sdk'
import nodemailer from 'nodemailer'
import { useCompiler } from '#vue-email'

const debug = false
const frequency = 'everyFifteenMinutes'
const limit = 6
const issueId = '447eee5b-4c6b-4ed3-9fcb-1887f1cfa78e'

export default defineCronHandler(frequency, async () => {

  const config = useRuntimeConfig()
  const db = createDirectus(config.usersDbDomain).with(rest()).with(staticToken(config.usersDbToken))

  const issue = await db.request(readItem('issues', issueId, {
    fields: ['id', 'status']
  }))


  if (issue.status != 'published') {
    console.log('The newsletter is not published yet. Terminating sender.')
    return
  }

  const users = await db.request(readItems('users', {
    fields: ['*', 'sends.*'],
    limit,
    sort: ['date_created'],
    filter: {
      status: {
        _nin: ['spam', 'archived', 'unsubscribed']
      },
      sends: {
        _none: {
          issue: {
            _eq: issueId
          }
        }
      }
    }
  }))

  console.log(`New batch of ${users.length} emails is ready to be sent`)



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
      from: 'hi@chromatone.center',
      to: user?.email,
      subject: 'Chromatone Updates: June 2024',
      html: template.html,
      headers: {
        'Precedence': 'bulk',
        'List-Unsubscribe': `<${config.public.appDomain}/unsubscribe_address?email=${user?.email}>`,
      },
    }
    if (debug) {
      console.log('Debug send and terminate: ', user?.email)
      return
    }
    await transporter.sendMail(options)

    await db.request(createItem('sends', {
      user: user.id,
      issue: issueId
    }))


    let delay = 10 + Math.random() * 30

    console.log(`Sent to ${user?.email}.  Waiting ${delay.toFixed(1)}s before next.`)

    await delayPromise(delay * 1000);
  }
  console.log('Batch successfully sent. Restarting ', frequency)

}, { runOnInit: true })


const delayPromise = (ms) => new Promise(resolve => setTimeout(resolve, ms));