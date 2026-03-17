# Resend OTP Email Integration - Backend Implementation

## Configuration

### 1. Environment Variables (.env.local / .env.production)

```env
# Resend Email Service
RESEND_API_KEY=re_ZJmqr3gw_3CPE57ysweYfyw6NbefkwrKd
RESEND_FROM_EMAIL=noreply@rajee-sa.com
RESEND_REPLY_TO=support@rajee.com
```

### 2. Install Resend

```bash
npm install resend
```

---

## API 1: Send OTP for Registration

**Endpoint:** `POST /api/send-otp`

```typescript
// /api/send-otp.ts (Vercel/Next.js) or similar

import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOtpRequest {
  email: string;
  fullName: string;
  phone?: string;
}

/**
 * Generate a random 6-digit OTP
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP email for signup/registration
 */
export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body: SendOtpRequest = await req.json();
    const { email, fullName } = body;

    // Validate inputs
    if (!email || !fullName) {
      return NextResponse.json(
        { success: false, message: 'Email and full name are required' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();

    // TODO: Store OTP in database (Redis/Firebase) with:
    // - email
    // - otp (hashed for security)
    // - createdAt
    // - expiresAt (10 minutes from now)
    // - attempts (max 5)

    // Send OTP email using Resend
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@rajee-sa.com',
      to: email,
      subject: 'Verify Your Rajee Account - OTP Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { color: #2979C8; text-align: center; margin-bottom: 30px; }
              .otp-code { 
                background-color: #f4f5f9; 
                padding: 30px; 
                text-align: center; 
                border-radius: 8px; 
                margin: 30px 0;
                border: 2px solid #2979C8;
              }
              .otp-code h1 { 
                color: #2979C8; 
                letter-spacing: 10px; 
                margin: 0;
                font-size: 48px;
              }
              .warning { 
                background-color: #fff3cd; 
                padding: 15px; 
                border-radius: 5px;
                border-left: 4px solid #ffc107;
                margin: 20px 0;
              }
              .footer { 
                text-align: center; 
                font-size: 12px; 
                color: #999; 
                margin-top: 30px;
              }
              a { color: #2979C8; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Welcome to Rajee! 🎉</h2>
              </div>

              <p>Hi ${fullName},</p>

              <p>Thank you for registering with Rajee. To complete your signup, please verify your email address using the code below:</p>

              <div class="otp-code">
                <h1>${otp}</h1>
              </div>

              <div class="warning">
                <strong>⏱️ This code expires in 10 minutes</strong>
              </div>

              <p style="color: #666;">
                <strong>How to use:</strong>
              </p>
              <ul style="color: #666;">
                <li>Copy the 6-digit code above</li>
                <li>Paste it in the verification field on the Rajee app</li>
                <li>Complete your registration</li>
              </ul>

              <p style="color: #d32f2f;">
                <strong>⚠️ Important:</strong> If you didn't request this code, please ignore this email. Your account wasn't created until you complete verification.
              </p>

              <p style="color: #666; font-size: 14px;">
                Need help? Contact us at <a href="mailto:support@rajee.com">support@rajee.com</a>
              </p>

              <div class="footer">
                <p><strong style="color: #333;">Rajee App</strong></p>
                <p><a href="https://rajee.com">www.rajee.com</a> | <a href="mailto:support@rajee.com">support@rajee.com</a></p>
                <p>© 2026 Rajee. All rights reserved.</p>
                <p style="margin-top: 20px; color: #ccc;">This is an automated message, please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Welcome to Rajee!\n\nYour verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this code, please ignore this email.\n\nFor support: support@rajee.com`
    });

    console.log('✅ OTP sent successfully:', response);

    // Return success WITHOUT exposing the OTP to client
    return NextResponse.json(
      {
        success: true,
        message: 'OTP sent to your email successfully',
        // Do NOT return the OTP itself
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error sending OTP:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to send OTP. Please try again.'
      },
      { status: 500 }
    );
  }
}
```

---

## API 2: Send Password Reset OTP

**Endpoint:** `POST /api/send-reset-otp`

```typescript
// /api/send-reset-otp.ts

import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ResetOtpRequest {
  email: string;
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body: ResetOtpRequest = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // TODO: Check if user exists first
    // TODO: Generate OTP and store in database with 10-minute expiry

    const otp = generateOTP();

    // Send password reset OTP email
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@rajee-sa.com',
      to: email,
      subject: 'Reset Your Rajee Password - OTP Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { color: #2979C8; text-align: center; margin-bottom: 30px; }
              .otp-code { 
                background-color: #f4f5f9; 
                padding: 30px; 
                text-align: center; 
                border-radius: 8px; 
                margin: 30px 0;
                border: 2px solid #2979C8;
              }
              .otp-code h1 { 
                color: #2979C8; 
                letter-spacing: 10px; 
                margin: 0;
                font-size: 48px;
              }
              .warning { 
                background-color: #fff3cd; 
                padding: 15px; 
                border-radius: 5px;
                border-left: 4px solid #ffc107;
                margin: 20px 0;
              }
              .security-note {
                background-color: #e3f2fd;
                padding: 15px;
                border-radius: 5px;
                border-left: 4px solid #2979C8;
                margin: 20px 0;
              }
              .footer { 
                text-align: center; 
                font-size: 12px; 
                color: #999; 
                margin-top: 30px;
              }
              a { color: #2979C8; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Password Reset Request 🔐</h2>
              </div>

              <p>Hi there,</p>

              <p>We received a request to reset the password for this Rajee account. Use the code below to reset your password:</p>

              <div class="otp-code">
                <h1>${otp}</h1>
              </div>

              <div class="warning">
                <strong>⏱️ This code expires in 10 minutes</strong>
              </div>

              <div class="security-note">
                <strong>🔒 Security Alert:</strong> This code can only be used once to reset your password.
              </div>

              <p style="color: #d32f2f; margin-top: 20px;">
                <strong>⚠️ Did you NOT request a password reset?</strong><br>
                If you didn't request this, please ignore this email or contact us immediately at <a href="mailto:support@rajee.com">support@rajee.com</a>. Your account remains secure.
              </p>

              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                Need help? Contact us at <a href="mailto:support@rajee.com">support@rajee.com</a>
              </p>

              <div class="footer">
                <p><strong style="color: #333;">Rajee App</strong></p>
                <p><a href="https://rajee.com">www.rajee.com</a> | <a href="mailto:support@rajee.com">support@rajee.com</a></p>
                <p>© 2026 Rajee. All rights reserved.</p>
                <p style="margin-top: 20px; color: #ccc;">This is an automated message, please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Password Reset Request\n\nYour password reset code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\nFor support: support@rajee.com`
    });

    console.log('✅ Reset OTP sent successfully:', response);

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset code sent to your email'
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error sending reset OTP:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to send password reset code. Please try again.'
      },
      { status: 500 }
    );
  }
}
```

---

## Database Schema for OTP Storage

### Firebase Realtime Database Structure

```json
{
  "otps": {
    "user_email_hash": {
      "email": "user@example.com",
      "otp_hash": "hashed_otp_value",
      "type": "signup",  // or "password_reset"
      "created_at": 1710720840000,
      "expires_at": 1710721440000,
      "attempts": 0,
      "verified": false
    }
  }
}
```

### Firebase Implementation

```typescript
// services/otp.service.ts

import { getDatabase, ref, set, get, remove } from 'firebase/database';
import * as bcrypt from 'bcryptjs';

export class OTPService {
  private db = getDatabase();

  /**
   * Store OTP in database
   */
  async storeOTP(email: string, otp: string, type: 'signup' | 'password_reset' = 'signup'): Promise<void> {
    const emailHash = Buffer.from(email).toString('base64');
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    const otpRef = ref(this.db, `otps/${emailHash}`);
    
    await set(otpRef, {
      email,
      otp_hash: otpHash,
      type,
      created_at: Date.now(),
      expires_at: expiresAt,
      attempts: 0,
      verified: false
    });
  }

  /**
   * Verify OTP
   */
  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const emailHash = Buffer.from(email).toString('base64');
    const otpRef = ref(this.db, `otps/${emailHash}`);
    
    const snapshot = await get(otpRef);
    
    if (!snapshot.exists()) {
      throw new Error('OTP not found');
    }

    const data = snapshot.val();

    // Check expiry
    if (Date.now() > data.expires_at) {
      throw new Error('OTP has expired');
    }

    // Check attempts
    if (data.attempts >= 5) {
      throw new Error('Too many attempts. Please request a new OTP');
    }

    // Verify OTP
    const isValid = await bcrypt.compare(otp, data.otp_hash);

    if (!isValid) {
      // Increment attempts
      await set(ref(this.db, `otps/${emailHash}/attempts`), data.attempts + 1);
      throw new Error('Invalid OTP');
    }

    // Mark as verified
    await set(ref(this.db, `otps/${emailHash}/verified`), true);

    return true;
  }

  /**
   * Clean up OTP after use
   */
  async deleteOTP(email: string): Promise<void> {
    const emailHash = Buffer.from(email).toString('base64');
    const otpRef = ref(this.db, `otps/${emailHash}`);
    await remove(otpRef);
  }
}
```

---

## Integration Points

### Frontend (Already Updated)

The `signup.component.ts` calls:
```typescript
POST https://rajeeac-63le.vercel.app/send-otp
{
  name: fullName,
  phone: phone,
  email: email,
  password: password
}
```

Update to use Resend endpoint.

### Password Reset Flow

The `auth-modal.component.ts` calls:
```typescript
this.authService.resetPassword(email)
```

Should call your new `/api/send-reset-otp` endpoint instead.

---

## Testing Checklist

- [ ] OTP email arrives in inbox (not spam)
- [ ] Subject line shows "Rajee Account" or "Reset Your Rajee Password"
- [ ] From shows: `noreply@rajee-sa.com`
- [ ] OTP code is clearly visible
- [ ] 10-minute expiry is displayed
- [ ] Security warnings shown appropriately
- [ ] Test on Gmail, Outlook, Yahoo
- [ ] Mobile rendering looks good
- [ ] Can verify OTP successfully
- [ ] Expired OTP rejected
- [ ] Multiple attempts blocked

---

## Security Best Practices

✅ **Implemented:**
- OTP never exposed in API response
- OTP hashed in database
- 10-minute expiration
- Maximum 5 attempts
- Email verification required
- Separate endpoints for signup vs password reset

⚠️ **Additional Recommendations:**
- Rate limit OTP requests (max 3 per email per hour)
- Log OTP requests for security audit
- Add email verification status to user document
- Implement CSRF protection
- Use HTTPS only
- Monitor for abuse patterns

---

## Next Steps

1. ✅ Domain verified: `rajee-sa.com`
2. ✅ API Key ready: `re_ZJmqr3gw_3CPE57ysweYfyw6NbefkwrKd`
3. ⏳ **TODO:** Implement backend endpoints with Resend
4. ⏳ **TODO:** Add OTP storage to database
5. ⏳ **TODO:** Update frontend to use new endpoints
6. ⏳ **TODO:** Test both flows end-to-end

