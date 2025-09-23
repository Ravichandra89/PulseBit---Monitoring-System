// Sending Mails Single, Batch

import type React from "react";
import { render } from "@react-email/render";
import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";

// --- Email interfaces ---
export interface Emails {
  react: React.JSX.Element;
  subject: string;
  to: string[];
  from: string;
  reply_to?: string;
}

export type EmailHtml = {
  html: string;
  subject: string;
  to: string;
  from: string;
  reply_to?: string;
};

// --- Nodemailer transporter Factory
export const createTransporter = (): Transporter => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// ---- Sending single email with React Component
export const sendWithRender = async (email: Emails) => {
  if (process.env.NODE_ENV !== "production") return;

  const html = await render(email.react);
  const transporter = createTransporter();

  await transporter.sendMail({
    from: email.from,
    to: email.to.join(", "),
    subject: email.subject,
    html,
    replyTo: email.reply_to,
  });
};

// --- Send Multiple Emails - BatchEmails Sending
export const sendBatchEmailHtml = async (emails: EmailHtml[]) => {
  if (process.env.NODE_ENV !== "production") return;

  const transporter = createTransporter();

  for (const email of emails) {
    await transporter.sendMail({
      from: email.from,
      to: email.to,
      subject: email.subject,
      html: email.html,
      replyTo: email.reply_to,
    });
  }
};

// ---
export const sendBatchWithRender = async (emails: Emails[]) => {
  if (process.env.NODE_ENV !== "production") return;

  const transporter = createTransporter();

  for (const email of emails) {
    const html = await render(email.react);
    await transporter.sendMail({
      from: email.from,
      to: email.to.join(", "),
      subject: email.subject,
      html,
      replyTo: email.reply_to,
    });
  }
};
