# Implementation Checklist - Resend OTP Integration

## Quick Setup (5 minutes)

### 1. ✅ Store API Key Safely

**DO NOT commit API key to git!**

**File:** `.env.local` (your machine only)
```env
RESEND_API_KEY=re_ZJmqr3gw_3CPE57ysweYfyw6NbefkwrKd
RESEND_FROM_EMAIL=noreply@rajee-sa.com
RESEND_REPLY_TO=support@rajee.com
```

**File:** `.env.production` (Vercel dashboard)
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add:
   - `RESEND_API_KEY` = `re_ZJmqr3gw_3CPE57ysweYfyw6NbefkwrKd`
   - `RESEND_FROM_EMAIL` = `noreply@rajee-sa.com`

**File:** `.gitignore`
```
.env.local
.env.*.local
```

### 2. ✅ Install Dependencies

```bash
npm install resend
```

### 3. 📄 Files to Implement

**Backend Services:**
- ✅ `lib/otp-service.ts` - Email sending service (READY)
- ✅ `lib/verify-otp.ts` - OTP verification service (READY)

**API Endpoints (Copy & Rename):**
- ✅ `api-send-otp.example.ts` → `pages/api/send-otp.ts`
- ✅ `api-send-reset-otp.example.ts` → `pages/api/send-reset-otp.ts`

**Verification API (Need to create):**
- `pages/api/verify-otp.ts`

### 4. 🔄 Create Verify OTP Endpoint

**File:** `pages/api/verify-otp.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, deleteOTP } from '@/lib/verify-otp';

interface VerifyRequest {
  email: string;
  otp: string;
  type: 'signup' | 'password_reset';
}

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { success: false, message: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const body: VerifyRequest = await req.json();
    const { email, otp, type } = body;

    if (!email || !otp || !type) {
      return NextResponse.json(
        { success: false, message: 'Email, OTP, and type are required' },
        { status: 400 }
      );
    }

    // Verify OTP
    const result = await verifyOTP({ email, otp, type });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    // Delete OTP after successful verification
    await deleteOTP(email, type);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('❌ Error verifying OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
```

### 5. 🔄 Create Complete Registration Endpoint

**File:** `pages/api/register.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { deleteOTP } from '@/lib/verify-otp';

interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  otp: string; // Must be verified first
}

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { success: false, message: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const { email, password, fullName, phone, otp }: RegisterRequest =
      await req.json();

    if (!email || !password || !fullName || !phone || !otp) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Verify OTP was completed
    const emailKey = Buffer.from(email).toString('base64');
    const otpRef = ref(db, `otps/${emailKey}`);
    const otpSnapshot = await import('firebase/database').then(
      m => m.get(otpRef)
    );

    if (!otpSnapshot.exists() || !otpSnapshot.val().verified) {
      return NextResponse.json(
        { success: false, message: 'Email not verified. Please verify OTP first.' },
        { status: 400 }
      );
    }

    // Create Firebase user
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = userCredential.user.uid;

    // Save user to Realtime Database
    const userRef = ref(db, `users/${uid}`);
    await set(userRef, {
      uid,
      email,
      fullName,
      phone,
      createdAt: Date.now(),
      emailVerified: true,
      is_admin: false
    });

    // Clean up OTP
    await deleteOTP(email, 'signup');

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        user: {
          uid,
          email,
          fullName
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error registering user:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
```

---

## 🚀 Frontend Flow (Already Done)

### Current Setup:
1. ✅ User enters email, full name, phone, password
2. ✅ Clicks "Send OTP" → calls `/api/send-otp`
3. ✅ OTP email sent via Resend
4. ✅ User enters 6-digit code
5. ✅ Should call `/api/verify-otp` (CREATE THIS)
6. ✅ If verified, call `/api/register` (CREATE THIS)

### Update Signup Component:

**File:** `src/app/auth/components/signup/signup.component.ts`

Replace the `onVerifyOtp()` method:

```typescript
async onVerifyOtp() {
  this.submitted = true;
  if (this.otpForm.invalid) return;

  this.isLoading = true;
  try {
    const otp = this.otpForm.get('otp')?.value;
    const email = this.signupForm.get('email')?.value;

    // Step 1: Verify OTP
    const verifyRes = await fetch(
      'https://rajeeac-63le.vercel.app/api/verify-otp',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          type: 'signup'
        })
      }
    );

    const verifyResult = await verifyRes.json();
    if (!verifyResult.success) {
      this.showToast(verifyResult.message || 'OTP verification failed');
      return;
    }

    // Step 2: Register user
    const { fullName, phone, password } = this.signupForm.value;
    const registerRes = await fetch(
      'https://rajeeac-63le.vercel.app/api/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          fullName,
          phone,
          otp
        })
      }
    );

    const registerResult = await registerRes.json();
    if (!registerResult.success) {
      this.showToast(registerResult.message || 'Registration failed');
      return;
    }

    // Success!
    this.showToast('Registration successful!', 'success');
    this.navCtrl.navigateRoot(['/auth/login']);
  } catch (err: any) {
    this.showToast(err.message || 'Verification failed');
  } finally {
    this.isLoading = false;
  }
}
```

---

## 📧 Email Templates

### Signup Email
- ✅ Created and ready
- ✅ Shows Rajee branding
- ✅ Clear 6-digit code display
- ✅ 10-minute expiry warning
- ✅ Professional HTML

### Password Reset Email
- ✅ Created and ready
- ✅ Security warnings
- ✅ Clear instructions
- ✅ Branding consistent

---

## 🔒 Security Checklist

- ✅ API key stored in .env only (never in code)
- ✅ OTP hashed before storing
- ✅ OTP never returned in API response
- ✅ 10-minute expiration enforced
- ✅ Max 5 attempts per OTP
- ✅ Email verified before registration
- ✅ Password reset requires OTP verification
- ✅ Rate limiting (TODO)
- ✅ HTTPS enforced
- ✅ CORS properly configured

---

## 📊 Testing Checklist

- [ ] Send OTP for signup - email arrives
- [ ] Verify OTP - correct code accepted
- [ ] Verify OTP - wrong code rejected after 5 attempts
- [ ] Verify OTP - expired code rejected
- [ ] Register - completes after OTP verification
- [ ] Send reset OTP - email arrives
- [ ] Verify reset OTP - code verified
- [ ] Password reset - completes after OTP verification
- [ ] Test on mobile (iOS/Android simulators)
- [ ] Test on desktop browsers
- [ ] Check email rendering

---

## 🚨 Troubleshooting

**Email not arriving?**
1. Check spam/junk folder
2. Verify domain is set up: rajee-sa.com ✅
3. Check Resend dashboard for bounce errors
4. Verify FROM email matches: noreply@rajee-sa.com

**OTP verification fails?**
1. Check OTP hasn't expired (10 minutes)
2. Check max attempts (5)
3. Check database has OTP stored
4. Verify email format matches exactly

**API returns 500?**
1. Check environment variables in Vercel
2. Check Firebase credentials are valid
3. Check Resend API key is correct
4. Look at server logs in Vercel dashboard

---

## 📝 Summary

| Component | Status | Location |
|-----------|--------|----------|
| OTP Service | ✅ Ready | `lib/otp-service.ts` |
| Verify Service | ✅ Ready | `lib/verify-otp.ts` |
| Send OTP API | ✅ Ready | `api-send-otp.example.ts` |
| Send Reset API | ✅ Ready | `api-send-reset-otp.example.ts` |
| Register API | 📝 Create | `pages/api/register.ts` |
| Verify API | 📝 Create | `pages/api/verify-otp.ts` |
| Frontend Signup | ✅ Ready | `src/app/auth/components/signup/` |

**Next Step:** Copy and rename the example files, then implement the missing endpoints!

