/**
 * OTP Verification Service
 * Handles verification of OTP codes stored in Firebase
 */

import { db } from '../src/environments/firebase-config'; // Correct Firebase config path
import { ref, get, set, remove } from 'firebase/database';

interface VerifyOTPParams {
  email: string;
  otp: string;
  type: 'signup' | 'password_reset';
}

/**
 * Hash OTP using SHA-256
 */
async function hashOTP(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify OTP code submitted by user
 */
export async function verifyOTP({
  email,
  otp,
  type
}: VerifyOTPParams): Promise<{
  success: boolean;
  message: string;
  userData?: any;
}> {
  try {
    // Validate inputs
    if (!email || !otp) {
      return {
        success: false,
        message: 'Email and OTP are required'
      };
    }

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return {
        success: false,
        message: 'OTP must be 6 digits'
      };
    }

    const emailKey = Buffer.from(email).toString('base64');

    // Determine which OTP storage to use
    const otpRefPath =
      type === 'signup' ? `otps/${emailKey}` : `reset_otps/${emailKey}`;
    const otpRef = ref(db, otpRefPath);

    // Get stored OTP
    const otpSnapshot = await get(otpRef);

    if (!otpSnapshot.exists()) {
      return {
        success: false,
        message: 'OTP not found. Please request a new code.'
      };
    }

    const otpData = otpSnapshot.val();

    // Check if OTP has expired
    if (Date.now() > otpData.expires_at) {
      // Clean up expired OTP
      await remove(otpRef);
      return {
        success: false,
        message: 'OTP has expired. Please request a new code.'
      };
    }

    // Check max attempts
    if (otpData.attempts >= 5) {
      return {
        success: false,
        message: 'Too many attempts. Please request a new OTP.'
      };
    }

    // Hash the provided OTP
    const providedOtpHash = await hashOTP(otp);

    // Verify OTP
    if (providedOtpHash !== otpData.otp_hash) {
      // Increment attempts
      const newAttempts = otpData.attempts + 1;
      await set(ref(db, `${otpRefPath}/attempts`), newAttempts);

      const remaining = 5 - newAttempts;
      return {
        success: false,
        message: `Invalid OTP. ${remaining} attempts remaining.`
      };
    }

    // OTP is valid! Mark as verified
    await set(ref(db, `${otpRefPath}/verified`), true);
    await set(ref(db, `${otpRefPath}/verified_at`), Date.now());

    // For signup: return user data so frontend knows who this is
    if (type === 'signup') {
      return {
        success: true,
        message: 'Email verified successfully',
        userData: {
          email: otpData.email,
          fullName: otpData.fullName,
          phone: otpData.phone
        }
      };
    }

    // For password reset: just confirm verification
    return {
      success: true,
      message: 'OTP verified successfully. You can now reset your password.'
    };
  } catch (error: any) {
    console.error('❌ Error verifying OTP:', error);
    return {
      success: false,
      message: error?.message || 'Failed to verify OTP. Please try again.'
    };
  }
}

/**
 * Clean up OTP after successful use
 */
export async function deleteOTP(
  email: string,
  type: 'signup' | 'password_reset'
): Promise<void> {
  try {
    const emailKey = Buffer.from(email).toString('base64');
    const otpRefPath =
      type === 'signup' ? `otps/${emailKey}` : `reset_otps/${emailKey}`;
    const otpRef = ref(db, otpRefPath);

    await remove(otpRef);
    console.log(`✅ OTP deleted for ${email}`);
  } catch (error) {
    console.error('❌ Error deleting OTP:', error);
    throw error;
  }
}

/**
 * Get OTP details (for admin/debugging only)
 * NEVER expose in production API
 */
export async function getOTPDetails(
  email: string,
  type: 'signup' | 'password_reset'
): Promise<any> {
  try {
    const emailKey = Buffer.from(email).toString('base64');
    const otpRefPath =
      type === 'signup' ? `otps/${emailKey}` : `reset_otps/${emailKey}`;
    const otpRef = ref(db, otpRefPath);

    const snapshot = await get(otpRef);
    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.val();
    return {
      ...data,
      otp_hash: '***' // Never expose hash
    };
  } catch (error) {
    console.error('❌ Error getting OTP details:', error);
    return null;
  }
}
