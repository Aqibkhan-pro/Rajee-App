"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetOtp = exports.verifyOtp = exports.sendOtp = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const resend_1 = require("resend");
admin.initializeApp();
const db = admin.database();
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
// Firebase Realtime DB keys cannot contain . so encode email
function encodeEmail(email) {
    return email.replace(/\./g, ',').replace(/@/g, '_at_');
}
/* ─────────────────────────────────────────
   sendOtp  — signup email verification
───────────────────────────────────────── */
exports.sendOtp = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ success: false, message: 'Method not allowed' });
        return;
    }
    const { email, fullName, name } = req.body;
    if (!email) {
        res.status(400).json({ success: false, message: 'Email is required' });
        return;
    }
    try {
        const otp = generateOtp();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
        const emailKey = encodeEmail(email);
        await db.ref(`otps/${emailKey}`).set({ otp, expiresAt, used: false });
        const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
        const displayName = fullName || name || 'User';
        await resend.emails.send({
            from: 'Rajee <noreply@rajee-sa.com>',
            to: email,
            subject: 'Your Rajee OTP Code',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p>Hi ${displayName},</p>
          <p>Your Rajee verification code is:</p>
          <div style="background: #f4f4f4; padding: 24px; text-align: center; border-radius: 8px; margin: 24px 0;">
            <span style="font-size: 40px; font-weight: bold; color: #222; letter-spacing: 10px;">${otp}</span>
          </div>
          <p>This code expires in <strong>10 minutes</strong>.</p>
          <p style="color: #888; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
          <p>— The Rajee Team</p>
        </div>
      `,
        });
        res.json({ success: true, message: 'OTP sent to email' });
    }
    catch (err) {
        console.error('sendOtp error:', err);
        res.status(500).json({ success: false, message: err.message || 'Failed to send OTP' });
    }
});
/* ─────────────────────────────────────────
   verifyOtp  — confirm signup OTP
───────────────────────────────────────── */
exports.verifyOtp = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ success: false, message: 'Method not allowed' });
        return;
    }
    const { email, otp } = req.body;
    if (!email || !otp) {
        res.status(400).json({ success: false, message: 'Email and OTP are required' });
        return;
    }
    try {
        const emailKey = encodeEmail(email);
        const snapshot = await db.ref(`otps/${emailKey}`).get();
        if (!snapshot.exists()) {
            res.status(400).json({ success: false, message: 'OTP not found. Please request a new one.' });
            return;
        }
        const data = snapshot.val();
        if (data.used) {
            res.status(400).json({ success: false, message: 'OTP already used.' });
            return;
        }
        if (Date.now() > data.expiresAt) {
            res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
            return;
        }
        if (String(data.otp) !== String(otp)) {
            res.status(400).json({ success: false, message: 'Invalid OTP.' });
            return;
        }
        await db.ref(`otps/${emailKey}`).update({ used: true });
        res.json({ success: true, message: 'OTP verified successfully' });
    }
    catch (err) {
        console.error('verifyOtp error:', err);
        res.status(500).json({ success: false, message: err.message || 'Verification failed' });
    }
});
/* ─────────────────────────────────────────
   sendResetOtp  — forgot password OTP
───────────────────────────────────────── */
exports.sendResetOtp = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ success: false, message: 'Method not allowed' });
        return;
    }
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ success: false, message: 'Email is required' });
        return;
    }
    try {
        const otp = generateOtp();
        const expiresAt = Date.now() + 10 * 60 * 1000;
        const emailKey = encodeEmail(email);
        await db.ref(`reset_otps/${emailKey}`).set({ otp, expiresAt, used: false });
        const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
            from: 'Rajee <noreply@rajee-sa.com>',
            to: email,
            subject: 'Rajee Password Reset Code',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Password Reset</h2>
          <p>Your password reset code for Rajee is:</p>
          <div style="background: #f4f4f4; padding: 24px; text-align: center; border-radius: 8px; margin: 24px 0;">
            <span style="font-size: 40px; font-weight: bold; color: #222; letter-spacing: 10px;">${otp}</span>
          </div>
          <p>This code expires in <strong>10 minutes</strong>.</p>
          <p style="color: #888; font-size: 13px;">If you didn't request a password reset, please ignore this email.</p>
          <p>— The Rajee Team</p>
        </div>
      `,
        });
        res.json({ success: true, message: 'Password reset OTP sent' });
    }
    catch (err) {
        console.error('sendResetOtp error:', err);
        res.status(500).json({ success: false, message: err.message || 'Failed to send reset OTP' });
    }
});
//# sourceMappingURL=index.js.map