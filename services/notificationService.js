const { isValidEmail } = require("../utils/validation");
const { findProfileByEmail } = require("../models/profileModel");
const { sendProfileNotificationEmail } = require("../utils/mailer");

async function sendNotificationIfEnabled({ email, subject, message }) {
  const normalized = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!normalized || !isValidEmail(normalized)) {
    return { sent: false, reason: "invalid_email" };
  }

  const profile = await findProfileByEmail(normalized);
  if (!profile) {
    return { sent: false, reason: "profile_not_found" };
  }
  if (!profile.email_notif) {
    return { sent: false, reason: "notifications_disabled" };
  }

  await sendProfileNotificationEmail({
    email: normalized,
    subject,
    message,
  });
  return { sent: true };
}

module.exports = {
  sendNotificationIfEnabled,
};