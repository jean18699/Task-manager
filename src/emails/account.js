const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'jean18699@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}`
    })
}

const sendCancelationEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'jean18699@gmail.com',
        subject: 'User cancellation',
        html: `<h1>WE ARE VERY SORRY</h1>`
    })
}

module.exports = {
    sendWelcomeEmail, sendCancelationEmail
}