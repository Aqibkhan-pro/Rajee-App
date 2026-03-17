// @ts-nocheck
/**
 * OTP Service using Resend
 * This service handles sending OTP emails for signup and password reset
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOTPParams {
  email: string;
  fullName: string;
  otp: string;
  type: 'signup' | 'password_reset';
}

/**
 * Generate a random 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP email using Resend
 */
export async function sendOTPEmail({
  email,
  fullName,
  otp,
  type
}: SendOTPParams) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }

  try {
    // Determine email template based on type
    const isSignup = type === 'signup';
    const subject = isSignup
      ? 'Verify Your Rajee Account - OTP Code'
      : 'Reset Your Rajee Password - OTP Code';

    const headerText = isSignup
      ? 'Welcome to Rajee! 🎉'
      : 'Password Reset Request 🔐';

    const mainText = isSignup
      ? `Thank you for registering with Rajee. To complete your signup, please verify your email address using the code below:`
      : `We received a request to reset the password for this Rajee account. Use the code below to reset your password:`;

    const warningText = isSignup
      ? `If you didn't request this code, please ignore this email. Your account wasn't created until you complete verification.`
      : `If you didn't request a password reset, please ignore this email or contact us immediately. Your account remains secure.`;

    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@rajee-sa.com',
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * { margin: 0; padding: 0; }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                line-height: 1.6; 
                color: #333; 
                background-color: #f9f9f9;
              }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
                background-color: #ffffff;
                border-radius: 8px;
              }
              .header { 
                color: #2979C8; 
                text-align: center; 
                margin-bottom: 30px;
                border-bottom: 3px solid #2979C8;
                padding-bottom: 20px;
              }
              .header h2 {
                font-size: 24px;
                margin: 0;
              }
              .content-wrapper {
                padding: 20px 0;
              }
              .otp-code { 
                background: linear-gradient(135deg, #f4f5f9 0%, #e8eaf6 100%);
                padding: 40px 30px; 
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
                font-weight: bold;
              }
              .warning { 
                background-color: #fff3cd; 
                padding: 15px 20px; 
                border-radius: 5px;
                border-left: 4px solid #ffc107;
                margin: 20px 0;
              }
              .security-note {
                background-color: #e3f2fd;
                padding: 15px 20px;
                border-radius: 5px;
                border-left: 4px solid #2979C8;
                margin: 20px 0;
              }
              .security-alert {
                background-color: #ffebee;
                padding: 15px 20px;
                border-radius: 5px;
                border-left: 4px solid #d32f2f;
                margin: 20px 0;
              }
              .footer { 
                text-align: center; 
                font-size: 12px; 
                color: #999; 
                margin-top: 30px;
                border-top: 1px solid #eee;
                padding-top: 20px;
              }
              .footer p {
                margin: 8px 0;
              }
              a { 
                color: #2979C8; 
                text-decoration: none;
              }
              a:hover {
                text-decoration: underline;
              }
              ul {
                margin-left: 20px;
                color: #666;
              }
              ul li {
                margin: 8px 0;
              }
              strong {
                color: #333;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>${headerText}</h2>
              </div>

              <div class="content-wrapper">
                <p>Hi ${fullName},</p>

                <p style="margin: 15px 0; color: #666;">${mainText}</p>

                <div class="otp-code">
                  <h1>${otp}</h1>
                </div>

                <div class="warning">
                  <strong>⏱️ This code expires in 10 minutes</strong>
                </div>

                ${
                  isSignup
                    ? `
                <p style="color: #666; margin: 20px 0;">
                  <strong>How to use:</strong>
                </p>
                <ul>
                  <li>Copy the 6-digit code above</li>
                  <li>Paste it in the verification field on the Rajee app</li>
                  <li>Complete your registration</li>
                </ul>
                `
                    : `
                <div class="security-note">
                  <strong>🔒 Security Alert:</strong> This code can only be used once to reset your password.
                </div>
                `
                }

                <div class="security-alert">
                  <strong>⚠️ Important:</strong> ${warningText}
                </div>

                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                  Need help? Contact us at <a href="mailto:support@rajee.com">support@rajee.com</a>
                </p>
              </div>

              <div class="footer">
                <p><strong style="color: #2979C8; font-size: 16px;">Rajee App</strong></p>
                <p>
                  <a href="https://rajee.com">www.rajee.com</a> | 
                  <a href="mailto:support@rajee.com">support@rajee.com</a>
                </p>
                <p>© 2026 Rajee. All rights reserved.</p>
                <p style="margin-top: 15px; color: #ccc;">This is an automated message, please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `${headerText}\n\nHi ${fullName},\n\n${mainText}\n\nYour code: ${otp}\n\nExpires in 10 minutes.\n\n${warningText}\n\nFor support: support@rajee.com`
    });

    return {
      success: true,
      messageId: response.id,
      message: 'OTP sent successfully'
    };
  } catch (error: any) {
    console.error('❌ Error sending OTP:', error);
    throw new Error(
      error?.message || 'Failed to send OTP email. Please try again.'
    );
  }
}

/**
 * Example: API Route for signup OTP (Next.js/Vercel)
 * 
 * File: /api/send-otp.ts
 * 
 * ```typescript
 * import { NextRequest, NextResponse } from 'next/server';
 * import { sendOTPEmail, generateOTP } from '@/lib/otp-service';
 * 
 * export async function POST(req: NextRequest) {
 *   try {
 *     const { email, fullName } = await req.json();
 *     
 *     if (!email || !fullName) {
 *       return NextResponse.json(
 *         { success: false, message: 'Email and full name required' },
 *         { status: 400 }
 *       );
 *     }
 *     
 *     const otp = generateOTP();
 *     
 *     // TODO: Store OTP in database
 *     
 *     await sendOTPEmail({
 *       email,
 *       fullName,
 *       otp,
 *       type: 'signup'
 *     });
 *     
 *     return NextResponse.json({
 *       success: true,
 *       message: 'OTP sent successfully'
 *     });
 *   } catch (error: any) {
 *     return NextResponse.json(
 *       { success: false, message: error.message },
 *       { status: 500 }
 *     );
 *   }
 * }
 * ```
 */
