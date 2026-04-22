const {
  MAX_NAME_LEN,
  PROFILE_LANGUAGES,
  clampFontSize,
  isValidEmail,
  isValidPhoneOptional,
  normalizeNameField,
  pickAllowed,
  toBool01,
} = require("../utils/validation");
const {
  findProfileByEmail,
  createProfile,
  updateProfileByEmail,
  updateTwoFactorByEmail,
} = require("../models/profileModel");
const { sendProfileNotificationEmail } = require("../utils/mailer");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const { sendNotificationIfEnabled } = require("../services/notificationService");

const PROFILE_PUT_KEYS = [
  "email",
  "first_name",
  "last_name",
  "phone",
  "dark_mode",
  "font_size",
  "language",
  "email_notif",
  "profile_photo",
  "two_factor_enabled",
];

function rowToProfile(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    first_name: row.first_name || "",
    last_name: row.last_name || "",
    phone: row.phone || "",
    profile_photo: row.profile_photo,
    dark_mode: Boolean(row.dark_mode),
    font_size: row.font_size || 50,
    language: row.language || "English (US)",
    email_notif: Boolean(row.email_notif),
    two_factor_enabled: Boolean(row.two_factor_enabled),
  };
}

function isDatabaseConnectionError(err) {
  return Boolean(
    err &&
      (err.code === "ECONNREFUSED" ||
        err.code === "PROTOCOL_CONNECTION_LOST" ||
        err.code === "ER_ACCESS_DENIED_ERROR" ||
        err.code === "ER_BAD_DB_ERROR")
  );
}

async function getProfile(req, res) {
  const email = typeof req.query.email === "string" ? req.query.email.trim() : "";
  if (!email) return res.status(400).json({ error: "Query ?email= is required" });
  if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email in query" });

  try {
    const row = await findProfileByEmail(email);
    if (!row) return res.status(404).json({ error: "Profile not found" });
    return res.json(rowToProfile(row));
  } catch (err) {
    console.error("profile get", err);
    if (isDatabaseConnectionError(err)) {
      return res.status(503).json({ error: "Database is not available. Please start MySQL and try again." });
    }
    return res.status(500).json({ error: "Could not load profile" });
  }
}

async function upsertProfile(req, res) {
  console.log("Received profile data:", req.body);
  
  const picked = pickAllowed(req.body ?? {}, PROFILE_PUT_KEYS);

  const emailRaw = typeof picked.email === "string" ? picked.email.trim() : "";
  if (!emailRaw) return res.status(400).json({ error: "email is required" });
  if (!isValidEmail(emailRaw)) return res.status(400).json({ error: "email must be a valid address" });

  const firstNameResult = normalizeNameField(picked.first_name, MAX_NAME_LEN);
  if (!firstNameResult.ok) return res.status(400).json({ error: `first_name ${firstNameResult.error}` });
  const lastNameResult = normalizeNameField(picked.last_name, MAX_NAME_LEN);
  if (!lastNameResult.ok) return res.status(400).json({ error: `last_name ${lastNameResult.error}` });

  let phone = null;
  if (picked.phone !== undefined && picked.phone !== null) {
    if (typeof picked.phone !== "string") return res.status(400).json({ error: "phone must be a string" });
    const pt = picked.phone.trim();
    if (!isValidPhoneOptional(pt)) {
      return res.status(400).json({ error: "phone must be valid (7-15 digits) or empty" });
    }
    phone = pt || null;
  }

  const dark_mode = toBool01(picked.dark_mode);
  const font_size = clampFontSize(picked.font_size, 50);

  let language = "English (US)";
  if (picked.language !== undefined) {
    if (typeof picked.language !== "string") return res.status(400).json({ error: "language must be a string" });
    const lt = picked.language.trim();
    if (!PROFILE_LANGUAGES.has(lt)) return res.status(400).json({ error: "language is not supported" });
    language = lt;
  }

  const email_notif = toBool01(picked.email_notif);
  const two_factor_enabled = toBool01(picked.two_factor_enabled);
  const profile_photo =
    typeof picked.profile_photo === "string" && picked.profile_photo.trim()
      ? picked.profile_photo.trim()
      : null;

  try {
    const existing = await findProfileByEmail(emailRaw);
    const payload = {
      email: emailRaw,
      first_name: firstNameResult.value,
      last_name: lastNameResult.value,
      phone,
      profile_photo,
      dark_mode,
      font_size,
      language,
      email_notif,
      two_factor_enabled,
    };

    if (!existing) {
      const newId = await createProfile(payload);
      console.log("Created new profile with ID:", newId);
      if (email_notif) {
        try {
          await sendProfileNotificationEmail({
            email: emailRaw,
            subject: "Profile Created",
            message: "Your profile has been created successfully.",
          });
        } catch (mailErr) {
          console.warn("profile notification email skipped:", mailErr.message);
        }
      }
      return res.status(201).json({ ok: true, created: true, id: newId });
    }

    await updateProfileByEmail(emailRaw, payload);
    console.log("Updated profile for email:", emailRaw);
    if (email_notif) {
      try {
        await sendProfileNotificationEmail({
          email: emailRaw,
          subject: "Profile updated successfully",
          message: "Your profile details were updated successfully.",
        });
      } catch (mailErr) {
        console.warn("profile notification email skipped:", mailErr.message);
      }
    }
    return res.json({ ok: true, updated: true });
  } catch (err) {
    console.error("profile put", err);
    if (isDatabaseConnectionError(err)) {
      return res.status(503).json({ error: "Database is not available. Please start MySQL and try again." });
    }
    return res.status(500).json({ error: "Could not save profile: " + err.message });
  }
}

async function getSecuritySettings(req, res) {
  const email = typeof req.query.email === "string" ? req.query.email.trim() : "";
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: "A valid email query parameter is required" });
  }

  try {
    const profile = await findProfileByEmail(email);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    return res.json({
      email: profile.email,
      two_factor_enabled: Boolean(profile.two_factor_enabled),
    });
  } catch (err) {
    console.error("security get", err);
    return res.status(500).json({ error: "Could not load security settings" });
  }
}

async function updateTwoFactor(req, res) {
  const { email, enabled } = req.body ?? {};
  const trimmed = typeof email === "string" ? email.trim() : "";
  if (!trimmed || !isValidEmail(trimmed)) {
    return res.status(400).json({ error: "A valid email is required" });
  }

  try {
    const profile = await findProfileByEmail(trimmed);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    await updateTwoFactorByEmail(trimmed, Boolean(enabled));
    try {
      await sendNotificationIfEnabled({
        email: trimmed,
        subject: enabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled",
        message: enabled
          ? "Two-factor authentication has been enabled on your account."
          : "Two-factor authentication has been disabled on your account.",
      });
    } catch (mailErr) {
      console.warn("2FA notification email skipped:", mailErr.message);
    }
    return res.json({ ok: true, two_factor_enabled: Boolean(enabled) });
  } catch (err) {
    console.error("security 2fa update", err);
    return res.status(500).json({ error: "Could not update two-factor authentication" });
  }
}

async function changePassword(req, res) {
  const { email, current_password, new_password, confirm_password } = req.body ?? {};
  const trimmed = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!trimmed || !isValidEmail(trimmed)) {
    return res.status(400).json({ error: "A valid email is required" });
  }
  if (typeof current_password !== "string" || !current_password) {
    return res.status(400).json({ error: "Current password is required" });
  }
  if (typeof new_password !== "string" || new_password.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters" });
  }
  if (new_password !== confirm_password) {
    return res.status(400).json({ error: "New password and confirm password do not match" });
  }
  if (!/[A-Z]/.test(new_password) || !/[a-z]/.test(new_password) || !/\d/.test(new_password)) {
    return res.status(400).json({ error: "Password must include uppercase, lowercase, and a number" });
  }

  try {
    const [users] = await pool.execute("SELECT id, password FROM users WHERE email = ?", [trimmed]);
    if (!users.length) return res.status(404).json({ error: "User not found" });

    const user = users[0];
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await pool.execute("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, user.id]);
    try {
      await sendNotificationIfEnabled({
        email: trimmed,
        subject: "Password changed successfully",
        message: "Your account password was changed successfully.",
      });
    } catch (mailErr) {
      console.warn("password notification email skipped:", mailErr.message);
    }
    return res.json({ ok: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("security password update", err);
    return res.status(500).json({ error: "Could not change password" });
  }
}

module.exports = {
  getProfile,
  upsertProfile,
  getSecuritySettings,
  updateTwoFactor,
  changePassword,
};