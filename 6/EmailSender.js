const nodemailer = require('nodemailer');

module.exports = (from, to, message) => {

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
        from: from,
        to: to,
        subject: 'Cwp-6',
        html: `<p>${message}</p>`
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });
};