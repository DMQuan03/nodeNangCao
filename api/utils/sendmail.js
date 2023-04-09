const nodemailer = require("nodemailer")
const asyncHandler = require("express-async-handler")
// fix tam loi khong send duoc mail
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const sendMail = async({email , html}) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_NAME, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
});

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"duongminhquan " <duongminhquan3005@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: html, // html body
  });

  return info
}

module.exports = sendMail