export { default as FollowupEmail } from "../Templates/followup";
export { default as SubscriptionPageEmail } from "../Templates/subscription-page";
export { default as WelcomeEmail } from "../Templates/welcome";
export { default as TeamInvitationEmail } from "../Templates/team-invitation";
export { default as MonitorPausedEmail } from "../Templates/monitor-paused";
export { default as MonitorDeactivationEmail } from "../Templates/monitor-deactivation";
export { default as StatusReportEmail } from "../Templates/statusReport";

// Helper Methods
export {
  createTransporter,
  sendWithRender,
  sendBatchEmailHtml,
  sendBatchWithRender,
} from "./send";

// export the EmailClient
export { EmailClient } from "./client";
