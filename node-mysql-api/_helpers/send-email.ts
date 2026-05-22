import nodemailer from 'nodemailer';
import config from '../config.json';

let cachedTransporter: any;
let cachedDefaultFrom: string | undefined;

async function getTransporter() {
    const smtpOptions: any = (config as any).smtpOptions;
    const authUser = smtpOptions?.auth?.user;
    const authPass = smtpOptions?.auth?.pass;

    const hasPlaceholderCreds =
        !authUser ||
        !authPass ||
        String(authUser).includes('YOUR_') ||
        String(authPass).includes('YOUR_');

    if (hasPlaceholderCreds) {
        throw new Error(
            'SMTP is not configured. Update config.json smtpOptions.auth.user and smtpOptions.auth.pass with your Ethereal credentials.'
        );
    }

    if (cachedTransporter) return cachedTransporter;

    cachedDefaultFrom = (config as any).emailForm;
    cachedTransporter = nodemailer.createTransport(smtpOptions);
    return cachedTransporter;
}

export default async function sendEmail({ to, subject, html, from = (config as any).emailForm }: any) {
    const transporter = await getTransporter();
    await transporter.sendMail({ from, to, subject, html });
}
