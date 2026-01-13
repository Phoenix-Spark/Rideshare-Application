import nodemailer from 'nodemailer';
import { getEmailTemplate, type EmailTemplateData } from './templates';

export async function sendEmail(to: string, template: EmailTemplateData, from?: string) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP configuration is missing from environment variables.");
  }

  const { subject, text, html } = getEmailTemplate(template);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: from || `"Base Bound" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
}
