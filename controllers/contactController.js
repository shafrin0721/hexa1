const pool = require("../config/db");
const {
  MAX_NAME_LEN,
  MESSAGE_MAX_LEN,
  MESSAGE_MIN_LEN,
  isValidEmail,
  pickAllowed,
} = require("../utils/validation");

const CONTACT_KEYS = ["name", "email", "message"];

async function createContact(req, res) {
  console.log("Received contact request:", req.body);
  
  const picked = pickAllowed(req.body ?? {}, CONTACT_KEYS);

  const name = typeof picked.name === "string" ? picked.name.trim() : "";
  const email = typeof picked.email === "string" ? picked.email.trim() : "";
  const message = typeof picked.message === "string" ? picked.message.trim() : "";

  // Validation
  if (!name) return res.status(400).json({ error: "Name is required" });
  if (name.length > MAX_NAME_LEN) {
    return res.status(400).json({ error: `Name must be at most ${MAX_NAME_LEN} characters` });
  }
  if (!isValidEmail(email)) return res.status(400).json({ error: "A valid email address is required" });
  if (message.length < MESSAGE_MIN_LEN) {
    return res.status(400).json({ error: `Message must be at least ${MESSAGE_MIN_LEN} characters` });
  }
  if (message.length > MESSAGE_MAX_LEN) {
    return res.status(400).json({ error: `Message must be at most ${MESSAGE_MAX_LEN} characters` });
  }

  try {
    // Create table if it doesn't exist with proper AUTO_INCREMENT
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await pool.execute(createTableQuery);
    console.log("Table ensured to exist with proper structure");

    // Insert the message
    const [result] = await pool.execute(
      "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
      [name, email, message],
    );
    
    console.log("Message saved with ID:", result.insertId);
    
    return res.status(201).json({ 
      ok: true, 
      id: result.insertId, 
      message: "Message sent successfully! We'll get back to you soon." 
    });
  } catch (err) {
    console.error("Database error in contact insert:", err);
    return res.status(500).json({ error: "Could not save message. Please try again later." });
  }
}

module.exports = {
  createContact,
};