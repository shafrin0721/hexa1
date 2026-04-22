const db = require('../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const { sendTwoFactorOtpEmail } = require("../utils/mailer");
const { sendNotificationIfEnabled } = require("../services/notificationService");

const otpStore = new Map();

function issueToken(user) {
    return jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

const register = async (req, res) => {
    const { name, email, password } = req.body; 

    try {
        const [userExists] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (userExists.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // අලුතින් Register වන සියලු දෙනා 'customer' ලෙස ඇතුළත් වේ
        await db.execute(
            'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'customer'] 
        );

        res.status(201).json({ success: true, message: 'Registration successful!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const [profiles] = await db.execute(
            "SELECT two_factor_enabled FROM profiles WHERE email = ? LIMIT 1",
            [user.email]
        );
        const twoFactorEnabled = Boolean(profiles[0]?.two_factor_enabled);

        if (twoFactorEnabled) {
            const otpCode = String(crypto.randomInt(100000, 1000000));
            const otpEmailKey = String(user.email).trim().toLowerCase();
            otpStore.set(otpEmailKey, {
                code: otpCode,
                expiresAt: Date.now() + 10 * 60 * 1000,
            });
            await sendTwoFactorOtpEmail({ email: otpEmailKey, otpCode });
            return res.status(200).json({
                success: true,
                requiresTwoFactor: true,
                message: "Two-factor verification required. OTP sent to your email.",
                user: {
                    id: user.id,
                    name: user.full_name,
                    email: user.email,
                    role: user.role
                }
            });
        }

        const token = issueToken(user);
        try {
            await sendNotificationIfEnabled({
                email: String(user.email || "").toLowerCase(),
                subject: "New account login detected",
                message: "Your account was signed in successfully. If this was not you, change your password immediately.",
            });
        } catch (mailErr) {
            console.warn("login notification email skipped:", mailErr.message);
        }

        res.status(200).json({
            success: true,
            message: `Welcome back, ${user.full_name}`,
            token,
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                role: user.role // Frontend එකට අඳුරගන්න role එකත් යවනවා
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const verifyTwoFactor = async (req, res) => {
    const { email, otp } = req.body ?? {};
    if (typeof email !== "string" || typeof otp !== "string") {
        return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();
        const otpEntry = otpStore.get(normalizedEmail);
        if (!otpEntry) {
            return res.status(400).json({ success: false, message: "No OTP pending for this account" });
        }
        if (Date.now() > otpEntry.expiresAt) {
            otpStore.delete(normalizedEmail);
            return res.status(400).json({ success: false, message: "OTP expired. Please login again." });
        }
        if (otpEntry.code !== otp.trim()) {
            return res.status(400).json({ success: false, message: "Invalid OTP code" });
        }

        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const user = users[0];
        otpStore.delete(normalizedEmail);
        const token = issueToken(user);
        return res.status(200).json({
            success: true,
            message: "Two-factor verification successful",
            token,
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const me = async (req, res) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
        if (!token) {
            return res.status(401).json({ success: false, message: "Missing auth token" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [users] = await db.execute(
            "SELECT id, full_name, email, role FROM users WHERE id = ? LIMIT 1",
            [decoded.id]
        );
        if (!users.length) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const user = users[0];
        return res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

// CommonJS ක්‍රමයට export කිරීම
module.exports = { register, login, verifyTwoFactor, me };