# WhatsApp Sweepstake Creation — Setup Guide

This guide walks through integrating the WhatsApp Flow for sweepstake creation.

---

## 1. Database Migrations

Before anything works, you must push the migrations to your Supabase project.

**Option A: Via Supabase CLI (Cloud)**
```bash
supabase login  # if not already logged in
supabase migration push
```

**Option B: Via Supabase Dashboard**
1. Go to [dashboard.supabase.com](https://dashboard.supabase.com)
2. Select your project → SQL Editor
3. Copy-paste the contents of each migration file in order:
   - `supabase/migrations/028_add_sweepstake_verification.sql`
   - `supabase/migrations/029_create_verification_tokens.sql`
4. Run each (they're idempotent, so safe to re-run)

**Verify:**
```sql
-- Check verified_at column exists
SELECT column_name FROM information_schema.columns 
WHERE table_name='sweepstakes' AND column_name='verified_at';

-- Check verification_tokens table exists
SELECT * FROM sweepstake_verification_tokens LIMIT 1;  -- should fail until tokens exist
```

---

## 2. Environment Variables

Add to `.env.local` or your hosting platform:

```env
WHATSAPP_WEBHOOK_SECRET=your-secret-bearer-token-here
```

**Generate a secure token:**
```bash
openssl rand -base64 32
```

---

## 3. WhatsApp Business Setup

### 3.1 Create a WhatsApp Flow

In your WhatsApp Business Account (or Meta Business Suite):

1. **Create a new Flow**
   - Name: "Create Sweepstake"
   - Type: Form

2. **Add Form Fields** (in order):
   | Label | Variable Name | Type | Required | Notes |
   |-------|---------------|------|----------|-------|
   | Your email | email | Email | Yes | |
   | WhatsApp number (optional) | phone | Phone | No | For future phone-based lookup |
   | Sweepstake name | sweepstake_name | Short text | Yes | Max 100 chars |
   | Tournament | tournament_type | Dropdown | Yes | Options: `worldcup`, `eurovision` |
   | Entry fee (£) | entry_fee | Number | No | Default: 0 |
   | Draw mode | assignment_mode | Dropdown | No | Options: `random` (default), `auto`, `manual` |

3. **Configure Webhook Submission**
   - Endpoint: `https://playdrawr.co.uk/api/webhooks/whatsapp/create-sweepstake`
   - Method: POST
   - Headers:
     ```
     Authorization: Bearer your-secret-bearer-token-here
     Content-Type: application/json
     ```
   - Request body: All form fields as JSON

4. **Success Response**
   - Message: "✓ Sweepstake created! Check your email to verify."

5. **Publish the Flow**

### 3.2 Add Flow to Your Bot/Catalog

- Link the Flow to your WhatsApp bot or catalog
- Organizers should be able to click "Create sweepstake" → Flow opens

---

## 4. Email Verification Flow

**User experience:**

1. **Submit Flow** → WhatsApp collects form data → webhook creates unverified sweepstake
2. **Verification email arrives** → Contains "Verify sweepstake" button
3. **Click email link** → `https://playdrawr.co.uk/verify-sweepstake?token={UUID}`
4. **Redirect to dashboard** → `/dashboard/{id}?verified=1` (shows success toast)
5. **Unverified cleanup** → Cron runs every 6 hours, deletes unverified sweepstakes > 48hrs old

---

## 5. Testing Locally

### Start dev server:
```bash
npm run dev
```

### Manual webhook test (using curl):
```bash
curl -X POST http://localhost:3000/api/webhooks/whatsapp/create-sweepstake \
  -H "Authorization: Bearer your-secret-bearer-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "sweepstake_name": "My test sweep",
    "tournament_type": "worldcup",
    "entry_fee": "5",
    "assignment_mode": "random"
  }'
```

**Expected response:**
```json
{
  "ok": true,
  "sweepstake": {
    "id": "uuid-here",
    "name": "My test sweep",
    "verificationRequired": true,
    "message": "Check your email to verify your sweepstake"
  }
}
```

### Check verification email:
- Email should arrive at `test@example.com`
- Subject: "Verify your sweepstake: My test sweep"
- Click the verification link

### Check dashboard:
- Should redirect to `/dashboard/{id}?verified=1`
- Should show yellow "Pending verification" banner that disappears after verification
- Sweepstake should now be usable (add participants, etc.)

---

## 6. Cron Job (Auto-cleanup)

The cleanup job runs automatically every 6 hours on Vercel:
- **Path:** `/api/cron/cleanup-unverified-sweepstakes`
- **Schedule:** `0 */6 * * *` (every 6 hours, UTC)
- **Auth:** Requires `CRON_SECRET` env var (already set)
- **Behavior:** Deletes sweepstakes where `verified_at IS NULL AND created_at < NOW() - 48 hours`

**Manual trigger (for testing):**
```bash
curl -X GET https://playdrawr.co.uk/api/cron/cleanup-unverified-sweepstakes \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## 7. Deployment Checklist

Before deploying to production:

- [ ] Migrations pushed to Supabase
- [ ] `.env.local` updated with `WHATSAPP_WEBHOOK_SECRET`
- [ ] WhatsApp Flow created and tested in sandbox
- [ ] Webhook endpoint URL verified (should be your production domain)
- [ ] Email template tested (check `/api/email-preview` if available)
- [ ] Dashboard banner styling checked in Firefox/Safari (colors are Tailwind custom tokens)
- [ ] Cron job CRON_SECRET env var is set on Vercel
- [ ] Test full flow: WhatsApp submit → Email → Click link → Dashboard

---

## 8. Troubleshooting

### Webhook returns 401 Unauthorized
- Check `WHATSAPP_WEBHOOK_SECRET` matches header Bearer token
- Verify `Authorization: Bearer {token}` format (space between Bearer and token)

### Verification email never arrives
- Check Resend API key is set (`RESEND_API_KEY` env var)
- Check email address format is valid
- Look in `email_log` table — should show sent email
- Check spam folder

### Sweepstake doesn't appear in dashboard
- Verify user is logged in to the organiser account (if creating new account, may need to verify email first)
- Check `sweepstakes` table directly — sweepstake should exist with `verified_at IS NULL`
- Check organiser lookup succeeded — should have created organiser if email didn't exist

### Cron job not running
- Check Vercel logs (Deployments → Cron)
- Verify `CRON_SECRET` is set in Vercel env vars
- Manual trigger test with curl (see section 6)

---

## 9. Future Improvements

- [ ] Support phone number lookup (requires adding `phone` column to `organisers` table)
- [ ] Allow resending verification email from dashboard
- [ ] SMS verification as alternative to email
- [ ] WhatsApp reply to verification with automatic confirmation

---

## Support

If anything breaks, check:
1. Console logs: `npm run dev` output
2. Supabase logs: Dashboard → Logs
3. Email audit trail: Check `email_log` table in Supabase
4. Network requests: DevTools → Network tab (for webhook tests)
