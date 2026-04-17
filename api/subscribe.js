function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function getSupabaseConfig() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.polynotice_waitlist_SUPABASE_URL ||
    null;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.polynotice_waitlist_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.polynotice_waitlist_SUPABASE_SECRET_KEY ||
    null;

  return { url, serviceRoleKey };
}

async function storeWaitlistSignup(email, request) {
  const { url, serviceRoleKey } = getSupabaseConfig();

  if (!url || !serviceRoleKey) {
    throw new Error('missing_supabase_config');
  }

  const forwardedFor = request.headers['x-forwarded-for'];
  const ipAddress = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(',')[0]?.trim() || request.socket?.remoteAddress || null;
  const source = request.headers.referer || request.headers.origin || null;
  const userAgent = request.headers['user-agent'] || null;

  const response = await fetch(`${url}/rest/v1/waitlist_signups?on_conflict=email`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation,resolution=ignore-duplicates',
    },
    body: JSON.stringify([
      {
        email,
        ip_address: ipAddress,
        source,
        user_agent: userAgent,
      },
    ]),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`supabase_request_failed:${response.status}:${errorText}`);
  }

  const rows = await response.json();
  return rows.length > 0;
}

function getClientErrorMessage(error) {
  const message = error?.message || '';

  if (message.includes('missing_supabase_config')) {
    return 'Supabase configuration is missing in the deployment environment.';
  }

  if (message.includes('supabase_request_failed:401')) {
    return 'Supabase rejected the server key.';
  }

  if (message.includes('supabase_request_failed:404')) {
    return 'The waitlist_signups table was not found in Supabase.';
  }

  if (message.includes('supabase_request_failed:42')) {
    return 'The waitlist_signups table schema needs to be created or updated.';
  }

  if (message.includes('fetch failed') || message.includes('ENOTFOUND')) {
    return 'The database connection failed.';
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
