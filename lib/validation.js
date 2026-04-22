const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const MAX_NAME_LEN = 50;
const MESSAGE_MIN_LEN = 10;
const MESSAGE_MAX_LEN = 500;
function isValidEmail(value) {
  const s = value.trim();
  return s.length > 0 && s.length <= 254 && EMAIL_REGEX.test(s);
}
function isValidPhone(value) {
  const s = value.trim();
  if (!s) return true;
  if (s.length > 50) return false;
  const digits = s.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}
function validateContactForm(name, email, message) {
  const n = name.trim();
  if (!n) return "Please enter your name.";
  if (n.length > MAX_NAME_LEN) return `Name must be at most ${MAX_NAME_LEN} characters.`;
  if (!isValidEmail(email)) return "Please enter a valid email address.";
  const m = message.trim();
  if (m.length < MESSAGE_MIN_LEN) return `Message must be at least ${MESSAGE_MIN_LEN} characters.`;
  if (m.length > MESSAGE_MAX_LEN) return `Message must be at most ${MESSAGE_MAX_LEN} characters.`;
  return null;
}
function clampFontSize(n, defaultValue = 50) {
  if (!Number.isFinite(n)) return defaultValue;
  return Math.min(100, Math.max(0, Math.round(n)));
}
export {
  EMAIL_REGEX,
  MAX_NAME_LEN,
  MESSAGE_MAX_LEN,
  MESSAGE_MIN_LEN,
  clampFontSize,
  isValidEmail,
  isValidPhone,
  validateContactForm
};
