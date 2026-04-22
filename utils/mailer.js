const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendContactEmail({ name, email, message }) {
  const recipient = process.env.GMAIL_RECIPIENT || process.env.GMAIL_USER;

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("GMAIL_USER or GMAIL_APP_PASSWORD not set - skipping email send.");
    return { skipped: true };
  }

  const mailOptions = {
    from: `"Hexal Contact Form" <${process.env.GMAIL_USER}>`,
    to: recipient,
    replyTo: email,
    subject: `New Contact Message from ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#111318;margin-bottom:4px;">New Contact Message</h2>
        <p style="color:#6b707c;font-size:14px;margin-top:0;">Received via the Hexal website contact form</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
        <table style="width:100%;font-size:14px;color:#111318;">
          <tr><td style="padding:6px 0;font-weight:600;width:80px;">Name</td>
          <td>${name}</td>
          </tr>
          <tr><td style="padding:6px 0;font-weight:600;">Email</td>
          <td><a href="mailto:${email}">${email}</a></td>
          </tr>
        </table>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
        <p style="font-size:14px;color:#111318;white-space:pre-wrap;">${message}</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  return { sent: true, messageId: info.messageId };
}

async function sendTwoFactorOtpEmail({ email, otpCode }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("GMAIL_USER or GMAIL_APP_PASSWORD not set - skipping OTP email send.");
    return { skipped: true };
  }

  const info = await transporter.sendMail({
    from: `"Hexal Security" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your Hexal verification code",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#111318;margin-bottom:8px;">Two-Factor Authentication Code</h2>
        <p style="font-size:14px;color:#111318;">Use this one-time code to complete your login:</p>
        <p style="font-size:28px;letter-spacing:4px;font-weight:700;color:#111318;">${otpCode}</p>
        <p style="font-size:12px;color:#6b707c;">This code expires in 10 minutes.</p>
      </div>
    `,
  });

  return { sent: true, messageId: info.messageId };
}

async function sendProfileNotificationEmail({ email, subject, message }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("GMAIL_USER or GMAIL_APP_PASSWORD not set - skipping profile notification email.");
    return { skipped: true };
  }

  const info = await transporter.sendMail({
    from: `"Hexal Notifications" <${process.env.GMAIL_USER}>`,
    to: email,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#111318;margin-bottom:8px;">${subject}</h2>
        <p style="font-size:14px;color:#111318;white-space:pre-wrap;">${message}</p>
      </div>
    `,
  });

  return { sent: true, messageId: info.messageId };
}

module.exports = {
  sendContactEmail,
  sendTwoFactorOtpEmail,
  sendProfileNotificationEmail,
};