import mail from '@sendgrid/mail'

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export default (req, res) => {
  try {
    const body = JSON.parse(req.body)

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
