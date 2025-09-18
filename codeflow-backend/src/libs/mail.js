import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

export const sendMail = async (options) => {
    var mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            // Appears in header & footer of e-mails
            name: 'Task Manager',
            link: 'https://mailgen.js/',
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
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
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
            intro: "Welcome to App! We're very excited to have you on board.",
            action: {
                instructions: 'To get started with Our App, please click here:',
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

export const resetPasswordMailGenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: 'You have received this email because a password reset request for your account was received.',
            action: {
                instructions: 'Click the button below to reset your password:',
                button: {
                    color: '#DC4D2F',
                    text: 'Reset your password',
                    link: passwordResetUrl,
                },
            },
            outro: 'If you did not request a password reset, no further action is required.',
        },
    };
};

