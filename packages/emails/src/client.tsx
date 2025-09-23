/** @jsxImportSource react */

import { render } from "@react-email/render";
import nodemailer, { Transporter } from "nodemailer";

import FolloupEmail from "../Templates/followup";
import monitorAlertEmail from "../Templates/monitor-alerts";
import moitorDeactivationEmail from "../Templates/monitor-deactivation";
import MointorPausedEmail from "../Templates/monitor-paused";
import statusReportEmail from "../Templates/statusReport";
import subscriptionPageEmail from "../Templates/subscription-page";
import TeamInvitationEmail from "../Templates/team-invitation";
import WelcomeEmail from "../Templates/welcome";

/* — type-only imports to avoid value/type namespace collisions — */
import type { monitorAlertProps } from "../Templates/monitor-alerts";
import type { MonitorDeactivationProps } from "../Templates/monitor-deactivation";
import type { statusReportProps } from "../Templates/statusReport";
import type { subscriptionPageProps } from "../Templates/subscription-page";
import type { TeamInvitationProps } from "../Templates/team-invitation";

/* Map existing imports to PascalCase bindings for JSX usage */
const FollowupEmailComp = FolloupEmail;
const MonitorAlertEmailComp = monitorAlertEmail;
const MonitorDeactivationEmailComp = moitorDeactivationEmail;
const MonitorPausedEmailComp = MointorPausedEmail;
const StatusReportEmailComp = statusReportEmail;
const SubscriptionPageEmailComp = subscriptionPageEmail;
const TeamInvitationEmailComp = TeamInvitationEmail;
const WelcomeEmailComp = WelcomeEmail;

/* helper: chunk an array (used for batch sends) */
const chunk = <T,>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export class EmailClient {
  private readonly transporter: Transporter;

  constructor(opts: {
    host: string;
    port: number;
    user: string;
    pass: string;
  }) {
    this.transporter = nodemailer.createTransport({
      host: opts.host,
      port: opts.port,
      secure: opts.port === 465,
      auth: {
        user: opts.user,
        pass: opts.pass,
      },
    });
  }

  // Follow-up
  sendFollowUp = async (req: { to: string }) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Sending follow up email to ${req.to}`);
      return;
    }

    try {
      const html = await render(<FollowupEmailComp />);

      const info = await this.transporter.sendMail({
        from: `"PulseBit" <welcome@pulsebit.in>`,
        replyTo: `"PulseBit Support" <support@pulsebit.in>`,
        to: req.to,
        subject: "How's it going with PulseBit?",
        html,
      });

      console.log(
        `Sent follow up mail successfully to ${req.to}`,
        info.messageId
      );
      return info;
    } catch (err) {
      console.error(`Error sending follow up mail to ${req.to}:`, err);
      throw err;
    }
  };

  // Monitor alert
  sendMonitorAlert = async (req: monitorAlertProps & { to: string }) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Sending monitor alert email to ${req.to}`);
      return;
    }

    try {
      const html = await render(<MonitorAlertEmailComp {...req} />);

      const info = await this.transporter.sendMail({
        from: `"PulseBit Alerts" <notifications@pulsebit.in>`,
        to: req.to,
        subject: `${req.name ?? "Monitor"}: ${String(req.type).toUpperCase()}`,
        html,
      });

      console.log(`Sent monitor alert email to ${req.to}`, info.messageId);
      return info;
    } catch (err) {
      console.error(`Error sending monitor alert email to ${req.to}:`, err);
      throw err;
    }
  };

  // Monitor deactivation
  sendMonitorDeactivation = async (
    req: MonitorDeactivationProps & { to: string }
  ) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Sending monitor deactivation email to ${req.to}`);
      return;
    }

    try {
      const html = await render(<MonitorDeactivationEmailComp {...req} />);

      const info = await this.transporter.sendMail({
        from: `"PulseBit Alerts" <notifications@pulsebit.in>`,
        to: req.to,
        subject: "Your PulseBit monitor(s) will be deactivated",
        html,
      });

      console.log(
        `Sent monitor deactivation email to ${req.to}`,
        info.messageId
      );
      return info;
    } catch (err) {
      console.error(
        `Error sending monitor deactivation email to ${req.to}:`,
        err
      );
      throw err;
    }
  };

  // Monitor paused
  sendMonitorPaused = async (req: { to: string }) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Sending monitor paused email to ${req.to}`);
      return;
    }

    try {
      const html = await render(<MonitorPausedEmailComp />);

      const info = await this.transporter.sendMail({
        from: `"PulseBit Alerts" <notifications@pulsebit.in>`,
        to: req.to,
        subject: "Your PulseBit monitor(s) have been paused",
        html,
      });

      console.log(`Sent monitor paused email to ${req.to}`, info.messageId);
      return info;
    } catch (err) {
      console.error(`Error sending monitor paused email to ${req.to}:`, err);
      throw err;
    }
  };

  // Status report (batched)
  sendStatusReport = async (req: statusReportProps & { to: string[] }) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Sending status report emails to ${req.to.join(", ")}`);
      return;
    }

    try {
      const html = await render(<StatusReportEmailComp {...req} />);

      for (const recipients of chunk(req.to, 100)) {
        await Promise.all(
          recipients.map((subscriber) =>
            this.transporter.sendMail({
              from: `"${req.pageTitle}" <notifications@pulsebit.in>`,
              to: subscriber,
              subject: req.reportTitle,
              html,
            })
          )
        );
      }

      console.log(`Sent status report emails to ${req.to.length} subscribers`);
      return { sent: req.to.length };
    } catch (err) {
      console.error(
        `Error sending status report emails to ${req.to.join(", ")}:`,
        err
      );
      throw err;
    }
  };

  // Page subscription confirmation
  sendPageSubscription = async (
    req: subscriptionPageProps & { to: string }
  ) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Sending page subscription email to ${req.to}`);
      return;
    }

    try {
      const html = await render(<SubscriptionPageEmailComp {...req} />);

      const info = await this.transporter.sendMail({
        from: `"PulseBit Status" <notifications@pulsebit.in>`,
        to: req.to,
        subject: `Confirm your subscription to ${req.page}`,
        html,
      });

      console.log(`Sent page subscription email to ${req.to}`, info.messageId);
      return info;
    } catch (err) {
      console.error(`Error sending page subscription email to ${req.to}:`, err);
      throw err;
    }
  };

  // Team invitation
  sendTeamInvitation = async (req: TeamInvitationProps & { to: string }) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Sending team invitation email to ${req.to}`);
      return;
    }

    try {
      const html = await render(<TeamInvitationEmailComp {...req} />);

      const info = await this.transporter.sendMail({
        from: `"PulseBit Team" <notifications@pulsebit.in>`,
        to: req.to,
        subject: `You've been invited to join ${req.workspaceName ?? "PulseBit"}`,
        html,
      });

      console.log(`Sent team invitation email to ${req.to}`, info.messageId);
      return info;
    } catch (err) {
      console.error(`Error sending team invitation email to ${req.to}:`, err);
      throw err;
    }
  };

  // Welcome email
  sendWelcomeEmail = async (req: { to: string }) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Sending welcome email to ${req.to}`);
      return;
    }

    try {
      const html = await render(<WelcomeEmailComp />);

      const info = await this.transporter.sendMail({
        from: `"PulseBit" <welcome@pulsebit.in>`,
        to: req.to,
        subject: "Welcome to PulseBit!",
        html,
      });

      console.log(`Sent welcome email to ${req.to}`, info.messageId);
      return info;
    } catch (err) {
      console.error(`Error sending welcome email to ${req.to}:`, err);
      throw err;
    }
  };
}


