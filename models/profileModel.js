const pool = require("../config/db");

async function findProfileByEmail(email) {
  const [rows] = await pool.execute(
    "SELECT * FROM profiles WHERE email = ?",
    [email]
  );
  return rows[0] || null;
}

async function createProfile(profileData) {
  const {
    email,
    first_name,
    last_name,
    phone,
    profile_photo,
    dark_mode,
    font_size,
    language,
    email_notif,
    two_factor_enabled,
  } = profileData;

  const [result] = await pool.execute(
    `INSERT INTO profiles 
     (email, first_name, last_name, phone, profile_photo, dark_mode, font_size, language, email_notif, two_factor_enabled) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      email,
      first_name || null,
      last_name || null,
      phone || null,
      profile_photo || null,
      dark_mode ? 1 : 0,
      font_size || 50,
      language || "English (US)",
      email_notif ? 1 : 0,
      two_factor_enabled ? 1 : 0,
    ]
  );
  return result.insertId;
}

async function updateProfileByEmail(email, profileData) {
  const {
    first_name,
    last_name,
    phone,
    profile_photo,
    dark_mode,
    font_size,
    language,
    email_notif,
    two_factor_enabled,
  } = profileData;

  const [result] = await pool.execute(
    `UPDATE profiles SET 
     first_name = ?, 
     last_name = ?, 
     phone = ?, 
     profile_photo = ?, 
     dark_mode = ?, 
     font_size = ?, 
     language = ?, 
     email_notif = ?, 
     two_factor_enabled = ?,
     updated_at = CURRENT_TIMESTAMP
     WHERE email = ?`,
    [
      first_name || null,
      last_name || null,
      phone || null,
      profile_photo || null,
      dark_mode ? 1 : 0,
      font_size || 50,
      language || "English (US)",
      email_notif ? 1 : 0,
      two_factor_enabled ? 1 : 0,
      email,
    ]
  );
  return result.affectedRows;
}

async function updateTwoFactorByEmail(email, enabled) {
  const [result] = await pool.execute(
    "UPDATE profiles SET two_factor_enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?",
    [enabled ? 1 : 0, email]
  );
  return result.affectedRows;
}

async function deleteProfileByEmail(email) {
  const [result] = await pool.execute("DELETE FROM profiles WHERE email = ?", [email]);
  return result.affectedRows;
}

module.exports = {
  findProfileByEmail,
  createProfile,
  updateProfileByEmail,
  updateTwoFactorByEmail,
  deleteProfileByEmail,
};