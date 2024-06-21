let nodemailer=require('nodemailer');
let config=require('../settings/config');
const sendEmail = async (options) => {
    let transporter = nodemailer.createTransport({
        host: config.EMAIL_HOST,
        port: config.EMAIL_PORT,
        secure: config.EMAIL_SECURE,
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    let mailOptions = {
        from: `Flat-Finder <${config.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendEmail