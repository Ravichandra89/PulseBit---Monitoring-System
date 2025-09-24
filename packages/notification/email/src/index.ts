import prismaClient from "@pulsebit/db";
import { z } from "zod";
import { EmailClient } from "@pulsebit/emails";

const emailDataSchema = z.object({
  email: z.string().email(),
});

const emailClient = new EmailClient({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT),
  user: process.env.SMTP_USER!,
  pass: process.env.SMTP_PASS!,
});

type EmailPayload = {
  monitorId: number;
  notificationId: number;
  statusCode?: number;
  message?: string;
  cronTimestamp: number;
  latency?: number;
};

const sendEmail = async (
  type: "alert" | "recovery" | "degarded",
  payload: EmailPayload
) => {
  // notification & monitor fetching
  const monitor = await prismaClient.monitor.findUnique({
    where: {
      id: payload.monitorId,
    },
  });

  const notification = await prismaClient.notification.findUnique({
    where: {
      id: payload.notificationId,
    },
  });

  if (!monitor || !notification) return;

  const config = emailDataSchema.safeParse(JSON.parse(notification.data));
  if (!config.success) return;

  // send email via Nodemailer EmailClient
  await emailClient.sendMonitorAlert({
    name: monitor.name,
    type,
    to: config.data.email,
    url: monitor.url,
    status: payload.statusCode?.toString(),
    latency: payload.latency ? `${payload.latency}ms` : "N/A",
    timestamp: new Date(payload.cronTimestamp).toISOString(),
    message: payload.message,
  });
};

// Public API's
export const sendAlert = (payload: EmailPayload) => sendEmail("alert", payload);

export const sendRecovery = (payload: EmailPayload) =>
  sendEmail("recovery", payload);

export const sendDegarded = (payload: EmailPayload) =>
  sendEmail("degarded", payload);
