import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { Resend } from 'resend';

admin.initializeApp();

const db = admin.database();

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Firebase Realtime DB keys cannot contain . so encode email
function encodeEmail(email: string): string {
  return email.replace(/\./g, ',').replace(/@/g, '_at_');
}

/* ─────────────────────────────────────────
   sendOtp  — signup email verification
───────────────────────────────────────── */
export const sendOtp = onRequest({ cors: true }, async (req, res) => {

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  const { email, fullName, name } = req.body as {
    email?: string;
    fullName?: string;
    name?: string;
  };

  if (!email) {
    res.status(400).json({ success: false, message: 'Email is required' });
    return;
  }

  try {
    const otp = generateOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    const emailKey = encodeEmail(email);

    await db.ref(`otps/${emailKey}`).set({ otp, expiresAt, used: false });

    const resend = new Resend(process.env.RESEND_API_KEY);
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
  } catch (err: any) {
    console.error('sendOtp error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to send OTP' });
  }
});

/* ─────────────────────────────────────────
   verifyOtp  — confirm signup OTP
───────────────────────────────────────── */
export const verifyOtp = onRequest({ cors: true }, async (req, res) => {

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  const { email, otp } = req.body as { email?: string; otp?: string };

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

    const data = snapshot.val() as { otp: string; expiresAt: number; used: boolean };

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
  } catch (err: any) {
    console.error('verifyOtp error:', err);
    res.status(500).json({ success: false, message: err.message || 'Verification failed' });
  }
});

/* ─────────────────────────────────────────
   sendResetOtp  — forgot password OTP
───────────────────────────────────────── */
export const sendResetOtp = onRequest({ cors: true }, async (req, res) => {

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  const { email } = req.body as { email?: string };

  if (!email) {
    res.status(400).json({ success: false, message: 'Email is required' });
    return;
  }

  try {
    const otp = generateOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const emailKey = encodeEmail(email);

    await db.ref(`reset_otps/${emailKey}`).set({ otp, expiresAt, used: false });

    const resend = new Resend(process.env.RESEND_API_KEY);

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
  } catch (err: any) {
    console.error('sendResetOtp error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to send reset OTP' });
  }
});
