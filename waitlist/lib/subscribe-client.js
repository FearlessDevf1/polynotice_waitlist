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

    // if (isLocalPreview()) {
    //   return {
    //     success: true,
    //     message: 'Local preview mode: subscription simulated successfully.',
    //   };
    // }

    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await parseResponseData(response);

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Subscription failed. Please try again.',
      };
    }

    return {
      success: true,
      message: data.message || 'Successfully added to waitlist! Check your email for confirmation.',
    };
  } catch (error) {
    console.error('Subscription error:', error);
    return {
      success: false,
      message: 'The subscription service is unavailable right now. Please try again later.',
    };
  }
}

async function parseResponseData(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return { message: text.trim() };
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// function isLocalPreview() {
//   return ['localhost', '127.0.0.1'].includes(window.location.hostname);
// }
