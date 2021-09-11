import mail from '@sendgrid/mail'
import { responsePathAsArray } from 'graphql'

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY)

export default async (req, res) => {
  try {
    console.log(process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY)
    const body = JSON.parse(req.body)
    const secret = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY

    const validateHuman = async (token) => {
      const res = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
        {
          method: 'POST'
        }
      )

      const data = await res.json()

      return data.success
    }

    const human = await validateHuman(body.token)
    if (!human) {
      return res.status(400).json({
        message: ' Get outta here bot!'
      })
    }

    const msg = {
      to: 'djent34@gmail.com',
      from: 'djent34@gmail.com', // Use the email address or domain you verified above
      subject: 'Commission Request',
      name: body.name,
      email: body.email,
      text: body.message,
      file: body.file
    }

    mail.send(msg)

    res.status(200).json({
      message:
        'Thank you for your request! I will contact you within a few business days of your request'
    })
  } catch (error) {
    console.error(error.message)

    return res.status(400).json({
      message: `Oops! Looks like there was an error! `
    })
  }
}
