import { sendAlert, sendDegarded, sendRecovery } from "./index";
const monitorId = 1; 
const notificationId = 1; 
const cronTimestamp = Date.now();


if (process.env.NODE_ENV === "development") {
  // Degraded notification
  void sendDegarded({
    monitorId,
    notificationId,
    cronTimestamp,
  });

  void sendAlert({
    monitorId,
    notificationId,
    statusCode: 500,
    cronTimestamp,
    message: "Service is down", 
  });

  void sendRecovery({
    monitorId,
    notificationId,
    cronTimestamp,
  });
}
