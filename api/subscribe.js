import { sql } from '@vercel/postgres';

let waitlistTableReady = false;

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function ensureWaitlistTable() {
  if (waitlistTableReady) {
    return;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS waitlist_signups (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      ip_address TEXT,
      source TEXT,
      user_agent TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    ALTER TABLE waitlist_signups
    ADD COLUMN IF NOT EXISTS ip_address TEXT;
  `;

  await sql`
    ALTER TABLE waitlist_signups
    ADD COLUMN IF NOT EXISTS source TEXT;
  `;

  await sql`
    ALTER TABLE waitlist_signups
    ADD COLUMN IF NOT EXISTS user_agent TEXT;
  `;

  await sql`
    ALTER TABLE waitlist_signups
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS waitlist_signups_created_at_idx
    ON waitlist_signups (created_at DESC);
  `;

  waitlistTableReady = true;
}

async function storeWaitlistSignup(email, request) {
  await ensureWaitlistTable();

  const forwardedFor = request.headers['x-forwarded-for'];
  const ipAddress = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(',')[0]?.trim() || request.socket?.remoteAddress || null;
  const source = request.headers.referer || request.headers.origin || null;
  const userAgent = request.headers['user-agent'] || null;

  const result = await sql`
    INSERT INTO waitlist_signups (email, ip_address, source, user_agent)
    VALUES (${email}, ${ipAddress}, ${source}, ${userAgent})
    ON CONFLICT (email) DO NOTHING
    RETURNING id;
  `;

  return result.rowCount > 0;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body || {};

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const wasInserted = await storeWaitlistSignup(email, req);

    return res.status(200).json({
      message: wasInserted
        ? "You're on the waitlist. We'll reach out when access opens."
        : 'You are already on the waitlist.',
    });
  } catch (error) {
    console.error('Subscribe handler error:', error);
    return res.status(500).json({
      message: 'Subscription failed. Please try again. nmmm',
    });
  }
}
