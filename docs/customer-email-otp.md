# Customer email OTP

Customer authentication uses the existing Supabase URL and publishable key on the server. It adds no database migrations and does not modify admin authentication or product authorization. The header account button supports sign-up, sign-in, verification, resending, session restoration/refresh and sign-out. Access and refresh tokens stay in HttpOnly, SameSite cookies; production cookies are Secure. The browser receives only the customer ID and email.

## Supabase email configuration

In the existing project's Authentication settings:

1. Ensure the Email provider and new-user signups are enabled. Keep email verification enabled.
2. Under Email Templates, include `{{ .Token }}` in both Magic Link and Confirm Signup templates. A suitable body is:

```html
<h2>Your Ranisa verification code</h2>
<p>Enter this one-time code on the Ranisa Boutique website:</p>
<p style="font-size:28px;letter-spacing:6px">{{ .Token }}</p>
<p>If you did not request this code, you can ignore this email.</p>
```

3. Keep the existing eight-digit email OTP configuration; the verification input accepts eight digits.
4. Configure custom SMTP for delivery to customers. Supabase's default SMTP is restricted to project-team email addresses and is not suitable for public customer sign-in. Do not store SMTP passwords in frontend code.
5. Test using a real customer inbox: sign up, verify, refresh the page, sign out, then sign in again. Test an invalid and expired code, resend, and confirm customer access cannot modify products or open admin controls.

The connected Supabase tools do not expose Auth email-template or SMTP configuration. Dashboard inspection confirmed: email and new-user signups are enabled, email confirmation is required, OTP length is eight digits, and custom SMTP is disabled. Template editing requires custom SMTP on the current plan. The connected Resend account has no verified sending domain. Public customer delivery remains blocked until SMTP is configured; no inbox verification has been completed.
