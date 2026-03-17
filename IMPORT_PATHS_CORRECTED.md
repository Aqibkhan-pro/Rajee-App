# ✅ CORRECTED SETUP - Import Paths Fixed

## Problem
The original example files had incorrect import paths:
- `@/lib/firebase` doesn't exist (should be `src/environments/firebase-config`)
- Path aliases weren't configured properly for backend routes

## Solution
All import paths have been corrected. Follow this structure:

---

## 📂 File Structure

```
rajee-app/
├── pages/
│   └── api/
│       ├── send-otp.ts              ← Copy from pages-api-send-otp-READY.ts
│       ├── send-reset-otp.ts        ← Copy from pages-api-send-reset-otp-READY.ts
│       └── verify-otp.ts            ← Create new
├── lib/
│   ├── otp-service.ts               ✅ READY (no changes)
│   └── verify-otp.ts                ✅ FIXED (import path corrected)
├── src/
│   ├── environments/
│   │   └── firebase-config.ts        ✅ Already exists and exports `db`
│   └── app/
│       └── auth/
│           └── components/
│               └── signup/
│                   └── signup.component.ts
├── .env.local                        ← Add your Resend API key
└── .env.example                      ✅ READY
```

---

## 🚀 Step-by-Step Setup

### 1️⃣ Create `pages/api/send-otp.ts`

Copy the content from `pages-api-send-otp-READY.ts` to:
```
pages/api/send-otp.ts
```

**File contents:**
- Lines 1-30: Imports (paths are CORRECT now)
- Lines 32-42: Interface definition
- Lines 45-50: OTP hashing function
- Lines 53-100+: POST handler with logging

### 2️⃣ Create `pages/api/send-reset-otp.ts`

Copy from `pages-api-send-reset-otp-READY.ts` to:
```
pages/api/send-reset-otp.ts
```

Same structure, just for password reset flow.

### 3️⃣ Create `pages/api/verify-otp.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, deleteOTP } from '../../lib/verify-otp';

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

export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Use POST method' },
    { status: 405 }
  );
}
```

### 4️⃣ Update `.env.local`

```env
# Resend Email Service
RESEND_API_KEY=re_ZJmqr3gw_3CPE57ysweYfyw6NbefkwrKd
RESEND_FROM_EMAIL=noreply@rajee-sa.com
RESEND_REPLY_TO=support@rajee.com

# Your other existing variables...
```

---

## ✅ Verify All Paths Are Correct

### In `lib/otp-service.ts`
```typescript
import { Resend } from 'resend';
// No Firebase import needed here ✅
```

### In `lib/verify-otp.ts`
```typescript
import { db } from '../src/environments/firebase-config'; ✅
import { ref, get, set, remove } from 'firebase/database';
```

### In `pages/api/send-otp.ts`
```typescript
import { db } from '../../src/environments/firebase-config'; ✅
import { sendOTPEmail, generateOTP } from '../../lib/otp-service'; ✅
```

### In `pages/api/send-reset-otp.ts`
```typescript
import { db } from '../../src/environments/firebase-config'; ✅
import { sendOTPEmail, generateOTP } from '../../lib/otp-service'; ✅
```

### In `pages/api/verify-otp.ts`
```typescript
import { verifyOTP, deleteOTP } from '../../lib/verify-otp'; ✅
```

---

## 🧪 Test the Setup

### 1. Start your development server
```bash
npm run dev
```

### 2. Test send-otp endpoint
```bash
curl -X POST http://localhost:3000/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullName": "John Doe",
    "phone": "0501234567"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "OTP sent to your email successfully. Check your inbox."
}
```

### 3. Check Firebase Realtime Database
Look for: `otps/dGVzdEBleGFtcGxlLmNvbQ==` (base64 encoded email)

### 4. Test verify-otp endpoint
```bash
curl -X POST http://localhost:3000/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456",
    "type": "signup"
  }'
```

**Expected response (if OTP is correct):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

## 🔧 Troubleshooting Import Errors

### Error: "Cannot find module '@/lib/firebase'"
✅ **Fixed!** Now imports from `'../src/environments/firebase-config'`

### Error: "db is not exported"
✅ **Check** that `src/environments/firebase-config.ts` has:
```typescript
export const db = getDatabase(app);
```

### Error: "sendOTPEmail is not a function"
✅ **Check** that `lib/otp-service.ts` exists and exports the function:
```typescript
export async function sendOTPEmail({ email, fullName, otp, type }: SendOTPParams)
```

### Error: Module not found during build
✅ **Make sure** file paths use:
- `../../` when going from `pages/api/` to `lib/`
- `../src/` when going from `lib/` to `src/`

---

## 📋 Checklist

- [ ] Copy `pages-api-send-otp-READY.ts` → `pages/api/send-otp.ts`
- [ ] Create `pages/api/send-reset-otp.ts` (code provided above)
- [ ] Create `pages/api/verify-otp.ts` (code provided above)
- [ ] Add Resend API key to `.env.local`
- [ ] Verify `lib/otp-service.ts` exists
- [ ] Verify `lib/verify-otp.ts` has correct import
- [ ] Verify `src/environments/firebase-config.ts` exports `db`
- [ ] Run `npm run dev`
- [ ] Test `/api/send-otp` endpoint
- [ ] Check Firebase Realtime Database for stored OTP
- [ ] Test `/api/verify-otp` endpoint

---

## 🎯 Summary

**Old (Broken):**
```typescript
import { db } from '@/lib/firebase'; ❌
```

**New (Fixed):**
```typescript
import { db } from '../../src/environments/firebase-config'; ✅
```

All files are now corrected and ready to use!

