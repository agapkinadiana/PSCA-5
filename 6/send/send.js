const nodemailer = require('nodemailer');

module.exports = (message) => {

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'agapkinadianaa@gmail.com',
            pass: 'DeWWsh123'
        }
    });

    const mailOptions = {
        from: 'agapkinadianaa@gmail.com',
        to: 'agapkinadiana@mail.ru',
        subject: 'Cwp-6',
        html: `<p>${message}</p>`
    };

    transporter.sendMail(mailOptions, () => {});
};