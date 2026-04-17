export async function subscribeEmail(email) {
  try {
    if (!email || !isValidEmail(email)) {
      return {
        success: false,
        message: 'Please provide a valid email address',
      };
    }

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
      message: data.message || "You're on the waitlist. We'll reach out when access opens.",
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
