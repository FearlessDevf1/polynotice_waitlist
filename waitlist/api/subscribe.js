/**
 * Waitlist Subscription API
 * Handles email subscriptions for the PolyNotice waitlist
 */

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
