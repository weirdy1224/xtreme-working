import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

export const sendMail = async (options) => {
    var mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            // Appears in header & footer of e-mails
            name: 'Mini Xtreme 2.0',
            link: 'https://edu.ieee.org/in-sairamit/',
            // Optional product logo
            // logo: 'https://mailgen.js/img/logo.png'
        },
    });

    var emailHTML = mailGenerator.generate(options.mailGenContent);
    var emailText = mailGenerator.generatePlaintext(options.mailGenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false, // true if port 465
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const mail = {
        from: '"Mini Xtreme Event Coordination Team" <maddison53@ethereal.email>', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: emailText, // plain text body
        html: emailHTML, // html body
    };

    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.error('Error occurred while sending mail:', error);
    }
};

export const emailVerificationMailGenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to Athena! We're very excited to have you on board.",
            action: {
                instructions: 'To get started with Mini Xtreme 2.0, please click here to verify your email:',
                button: {
                    color: '#22BC66',
                    text: 'Verify your email',
                    link: verificationUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};


