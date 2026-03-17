
// @ts-nocheck

import { NextRequest, NextResponse } from 'next/server';
import { sendOTPEmail, generateOTP } from '../../lib/otp-service';
import { db } from '../../src/environments/firebase-config';
import { ref, set } from 'firebase/database';

interface SendOtpRequest {
  email: string;
  fullName: string;
  phone?: string;
  password?: string;
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
    const body: SendOtpRequest = await req.json();
    const { email, fullName, phone } = body;

    // Validate inputs
    if (!email || !fullName) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and full name are required'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email format'
        },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = generateOTP();
    console.log(`📧 OTP for ${email}: ${otp}`);

    // Hash OTP before storing
    const otpHash = await hashOTP(otp);

    // Create unique key for OTP storage (base64 encoded email)
    const emailKey = Buffer.from(email).toString('base64');

    // Store OTP in Firebase with 10-minute expiry
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const otpRef = ref(db, `otps/${emailKey}`);

    await set(otpRef, {
      email,
      fullName,
      phone: phone || '',
      otp_hash: otpHash,
      type: 'signup',
      created_at: Date.now(),
      expires_at: expiresAt,
      attempts: 0,
      verified: false
    });

    console.log(`✅ OTP stored for ${email}`);

    // Send OTP email using Resend
    await sendOTPEmail({
      email,
      fullName,
      otp,
      type: 'signup'
    });

    console.log(`📤 OTP email sent to ${email}`);

    // Return success response (DO NOT include OTP)
    return NextResponse.json(
      {
        success: true,
        message: 'OTP sent to your email successfully. Check your inbox.'
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error in send-otp:', error);

    // Don't expose internal error details
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to send OTP. Please try again.'
      },
      { status: 500 }
    );
  }
}
