const sendmail=require('sendmail')({
    silent:true,
    smtpHost: 'localhost'
});

function send(x) {
    sendmail({
        from: "agapkinadiana@yandex.by",
        to: "agapkinadiana@yandex.by",
        subject: 'testSendmail',
        html: x
    }, function (err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });
}
module.exports = {
    send: send
}