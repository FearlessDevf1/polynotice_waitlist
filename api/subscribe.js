import { createPool, sql } from '@vercel/postgres';

let waitlistTableReady = false;

const postgresConnectionString =
  process.env.POSTGRES_URL || process.env.polynotice_waitlist_POSTGRES_URL || null;

const db = postgresConnectionString
  ? createPool({ connectionString: postgresConnectionString })
  : null;

const dbSql = db?.sql || sql;

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function ensureWaitlistTable() {
  if (waitlistTableReady) {
    return;
  }

  await dbSql`
    CREATE TABLE IF NOT EXISTS waitlist_signups (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      ip_address TEXT,
      source TEXT,
      user_agent TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await dbSql`
    ALTER TABLE waitlist_signups
    ADD COLUMN IF NOT EXISTS ip_address TEXT;
  `;

  await dbSql`
    ALTER TABLE waitlist_signups
    ADD COLUMN IF NOT EXISTS source TEXT;
  `;

  await dbSql`
    ALTER TABLE waitlist_signups
    ADD COLUMN IF NOT EXISTS user_agent TEXT;
  `;

  await dbSql`
    ALTER TABLE waitlist_signups
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  `;

  await dbSql`
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

  const result = await dbSql`
    INSERT INTO waitlist_signups (email, ip_address, source, user_agent)
    VALUES (${email}, ${ipAddress}, ${source}, ${userAgent})
    ON CONFLICT (email) DO NOTHING
    RETURNING id;
  `;

  return result.rowCount > 0;
}

function getClientErrorMessage(error) {
  const message = error?.message || '';

  if (message.includes('missing_connection_string') && process.env.polynotice_waitlist_POSTGRES_URL) {
    return 'The custom Postgres URL was found, but the database client could not initialize.';
  }

  if (message.includes('missing_connection_string')) {
    return 'No Postgres connection string was found in the deployment environment.';
  }

  if (message.includes('password authentication failed')) {
    return 'Vercel Postgres credentials were rejected.';
  }

  if (message.includes('connect ECONNREFUSED') || message.includes('ENOTFOUND')) {
    return 'The database connection failed.';
  }

  if (message.includes('relation "waitlist_signups" does not exist')) {
    return 'The waitlist table is missing.';
  }

  if (message.includes('column') && message.includes('does not exist')) {
    return 'The waitlist table schema is out of date.';
  }

  return 'Subscription failed. Please try again.';
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
      message: getClientErrorMessage(error),
    });
  }
}
