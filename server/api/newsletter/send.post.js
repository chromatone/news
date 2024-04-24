import nodemailer from 'nodemailer'
import { useCompiler } from '#vue-email'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.from || !body.to || !body.subject || !body.html || !body.unsubscribeUrl) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: from, to, subject, html, unsubscribeUrl',
    })
  }


  const template = await useCompiler('news.vue', {
    props: {
      name: 'Aspirant'
    }
  })

  const config = useRuntimeConfig()

  const transporter = nodemailer.createTransport({
    host: config.emailSmtpHost,
    port: config.emailSmtpPort,
    secure: config.emailSmtpSecure,
    auth: {
      user: config.emailSmtpUser,
      pass: config.emailSmtpPassword,
    },
  })

  const options = {
    from: body.from,
    to: body.to,
    subject: body.subject,
    html: template.html,
    // Add standard headers for bulk mail (refer to Yandex documentation)
    headers: {
      'Precedence': 'bulk',
      'List-Unsubscribe': `<${body.unsubscribeUrl}>`, // Use unsubscribe URL from request body
    },
  }

  await transporter.sendMail(options)
  return { message: 'Email sent' }
})
