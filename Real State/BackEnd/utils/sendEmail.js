const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')

const sendEmail = asyncHandler(async (data, req, res, next) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MP
    }
  })

  let info = await transporter.sendMail({
    from: 'OAS', // sender address
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html
  })

  console.log('Message sent: %s', info.messageId)
})

module.exports = { sendEmail }
