import nodemailer from 'nodemailer';
import config from '../../node-mysql-api/config.json';

export default async function sendEmail({ to, subject, html, from }: any) {
    const host = process.env.SMTP_HOST || config.smtpOptions.host;
    const port = parseInt(process.env.SMTP_PORT || String(config.smtpOptions.port));
    const user = process.env.SMTP_USER || config.smtpOptions.auth.user;
    const pass = process.env.SMTP_PASS || config.smtpOptions.auth.pass;

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: false,
        auth: {
            user,
            pass
        }
    });

    await transporter.sendMail({
        from: from || process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html
    });
}
