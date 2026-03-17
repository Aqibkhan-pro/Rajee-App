
// @ts-nocheck

import { NextRequest, NextResponse } from 'next/server';
import { sendOTPEmail, generateOTP } from '../../lib/otp-service';
import { db } from '../../src/environments/firebase-config';
import { ref, set, get } from 'firebase/database';

interface ResetOtpRequest {
  email: string;
}

/**
 * Hash OTP for secure storage
 */
async function hashOTP(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(req: NextRequest) {
  // Only allow POST
  if (req.method !== 'POST') {
    return NextResponse.json(
      { success: false, message: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    // Parse request body
    const body: ResetOtpRequest = await req.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // TODO: Check if user exists with this email
    const emailKey = Buffer.from(email).toString('base64');
    const userRef = ref(db, `users/${emailKey}`);
    const userSnapshot = await get(userRef);

    if (!userSnapshot.exists()) {
      // Security: Don't reveal if user exists or not
      // Just return success to prevent email enumeration
      console.log(`⚠️ Password reset requested for non-existent user: ${email}`);
      return NextResponse.json(
        {
          success: true,
          message: 'If this email exists, you will receive a password reset code.'
        },
        { status: 200 }
      );
    }

    // Generate 6-digit OTP
    const otp = generateOTP();
    console.log(`📧 Reset OTP for ${email}: ${otp}`);

    // Hash OTP before storing
    const otpHash = await hashOTP(otp);

    // Store reset OTP in Firebase with 10-minute expiry
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const resetOtpRef = ref(db, `reset_otps/${emailKey}`);

    await set(resetOtpRef, {
      email,
      otp_hash: otpHash,
      type: 'password_reset',
      created_at: Date.now(),
      expires_at: expiresAt,
      attempts: 0,
      used: false
    });

    console.log(`✅ Reset OTP stored for ${email}`);

    // Get user's full name for email
    const userData = userSnapshot.val();
    const fullName = userData?.name || userData?.fullName || 'User';

    // Send password reset OTP email using Resend
    await sendOTPEmail({
      email,
      fullName,
      otp,
      type: 'password_reset'
    });

    console.log(`📤 Password reset OTP email sent to ${email}`);

    // Return success response (DO NOT include OTP)
    return NextResponse.json(
      {
        success: true,
        message: 'If this email exists, you will receive a password reset code.'
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error in send-reset-otp:', error);

    // Don't expose internal error details
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send password reset code. Please try again.'
      },
      { status: 500 }
    );
  }
}
