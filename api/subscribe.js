const WAITLIST_CONFIRMATION_EMAIL = {
  subject: "You're in, welcome to PolyNotice",
  text: `Hey,

You're officially on the PolyNotice waitlist.

We’re building a system designed to give prediction market traders an edge - from real-time alerts to smarter trade monitoring and automation.

Right now, we’re focused on getting the core experience right before opening access.

Here’s what to expect:

- Early access before public launch
- Updates as we roll out key features
- A chance to shape how PolyNotice evolves

We’ll reach out as soon as the first version is ready.

If you're serious about trading prediction markets, you’ll want to be early here.

Until then, stay sharp.

- PolyNotice
polynotice@proton.me`,
};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function sendConfirmationEmail(email) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || 'PolyNotice <onboarding@resend.dev>';
  const replyTo = process.env.RESEND_REPLY_TO || 'polynotice@proton.me';

  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [email],
      reply_to: replyTo,
      subject: WAITLIST_CONFIRMATION_EMAIL.subject,
      text: WAITLIST_CONFIRMATION_EMAIL.text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${errorText}`);
  }
}

function getClientErrorMessage(error) {
  const message = error?.message || '';

  if (message.includes('Missing RESEND_API_KEY')) {
    return 'RESEND_API_KEY is missing in the Vercel environment variables.';
  }

  if (message.includes('Resend request failed: 401')) {
    return 'Resend rejected the API key. Check that RESEND_API_KEY is correct in Vercel.';
  }

  if (message.includes('Resend request failed: 403')) {
    return 'Resend rejected the sender configuration. Verify your sending domain or from address.';
  }

  if (message.includes('Resend request failed: 422')) {
    return 'Resend rejected the email payload. Check the from address and recipient format.';
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

    await sendConfirmationEmail(email);

    return res.status(200).json({
      message: "Successfully added to waitlist! Check your email for confirmation.",
    });
  } catch (error) {
    console.error('Subscribe handler error:', error);
    return res.status(500).json({
      message: getClientErrorMessage(error),
    });
  }
}
