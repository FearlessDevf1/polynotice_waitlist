/**
 * Waitlist Subscription API
 * Handles email subscriptions for the PolyNotice waitlist
 */

export const WAITLIST_CONFIRMATION_EMAIL = {
  from: 'polynotice@proton.me',
  subject: "You're in, welcome to PolyNotice",
  body: `Hey,

You're officially on the PolyNotice waitlist.

We’re building a system designed to give prediction market traders an edge — from real-time alerts to smarter trade monitoring and automation.

Right now, we’re focused on getting the core experience right before opening access.

Here’s what to expect:

• Early access before public launch
• Updates as we roll out key features
• A chance to shape how PolyNotice evolves

We’ll reach out as soon as the first version is ready.

If you're serious about trading prediction markets, you’ll want to be early here.

Until then, stay sharp.

— PolyNotice
polynotice@proton.me`,
};

export async function subscribeEmail(email) {
  try {
    if (!email || !isValidEmail(email)) {
      return {
        success: false,
        message: 'Please provide a valid email address',
      };
    }

    // Call backend API endpoint
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Subscription failed. Please try again.',
      };
    }

    return {
      success: true,
      message: 'Successfully added to waitlist! Check your email for confirmation.',
    };
  } catch (error) {
    console.error('Subscription error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again later.',
    };
  }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
