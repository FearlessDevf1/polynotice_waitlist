// ===== EMAIL REGEX VALIDATION =====
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ===== GENERIC FORM HANDLER =====
function handleFormSubmit(formElement, emailInputElement, messageElement) {
  formElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInputElement.value.trim();
    
    // Validate email
    if (!EMAIL_REGEX.test(email)) {
      showFormMessage(messageElement, 'Please enter a valid email address', 'error');
      return;
    }

    // Show loading state
    showFormMessage(messageElement, 'Subscribing...', '');

    try {
      // Simulate API call (replace with actual endpoint)
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }).catch(() => {
        return { ok: true };
      });

      if (response.ok) {
        showFormMessage(messageElement, '✓ You\'re on the waitlist! Check your email.', 'success');
        emailInputElement.value = '';
      } else {
        showFormMessage(messageElement, 'Something went wrong. Please try again.', 'error');
      }
    } catch (error) {
      showFormMessage(messageElement, 'Network error. Please try again.', 'error');
    }
  });
}

// ===== SHOW FORM MESSAGE =====
function showFormMessage(element, text, type) {
  element.textContent = text;
  element.className = type ? `${element.className.split(' ')[0]} ${type}` : element.className.split(' ')[0];
  
  // Auto-clear error messages after 5 seconds
  if (type === 'error') {
    setTimeout(() => {
      element.textContent = '';
      element.className = element.className.split(' ')[0];
    }, 5000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // ===== HAMBURGER MENU TOGGLE =====
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMobile = document.getElementById('nav-mobile');
  const navLinksMobile = document.querySelectorAll('.nav-link-mobile');

  if (hamburgerBtn && navMobile) {
    // Toggle menu when hamburger is clicked
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburgerBtn.classList.toggle('active');
      navMobile.classList.toggle('active');
    });

    // Close menu when a nav link is clicked
    navLinksMobile.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMobile.classList.remove('active');
      });
    });

    // Close menu when clicking outside the header
    document.addEventListener('click', (e) => {
      const topHeader = document.querySelector('.top-header');
      if (!topHeader.contains(e.target)) {
        hamburgerBtn.classList.remove('active');
        navMobile.classList.remove('active');
      }
    });
  }

  // ===== FINAL CTA FORM HANDLING =====
  const finalCtaForm = document.getElementById('final-cta-form');
  const finalCtaEmail = document.getElementById('final-cta-email');
  const finalCtaMessage = document.getElementById('final-cta-message');

  if (finalCtaForm && finalCtaEmail && finalCtaMessage) {
    handleFormSubmit(finalCtaForm, finalCtaEmail, finalCtaMessage);
  }
});

// MOBILE TOUCH EFFECT - REPLICATE HOVER BEHAVIOR ON MOBILE DEVICES //
const spans = document.querySelectorAll('section span');

// Handle touch movement
document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  updateSpanEffects(touch.clientX, touch.clientY);
}, { passive: true });

// Handle touch start
document.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  updateSpanEffects(touch.clientX, touch.clientY);
}, { passive: true });

// Handle touch end
document.addEventListener('touchend', () => {
  spans.forEach(span => span.classList.remove('active-touch'));
}, { passive: true });

function updateSpanEffects(x, y) {
  spans.forEach(span => {
    const rect = span.getBoundingClientRect();
    const spanCenterX = rect.left + rect.width / 2;
    const spanCenterY = rect.top + rect.height / 2;

    // Calculate distance from touch point to span center
    const distance = Math.hypot(x - spanCenterX, y - spanCenterY);

    // Apply effect to spans within a certain radius
    const radius = 45; // pixels

    if (distance < radius) {
      span.classList.add('active-touch');
    } else {
      span.classList.remove('active-touch');
    }
  });
}

// HIGHLIGHT SPANS BEHIND CONTENT ON HOVER //
document.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;

  // Check if mouse is over content layer or header
  const contentElement = document.elementFromPoint(x, y);
  const isOverContent = contentElement && (
    contentElement.closest('.content-layer') ||
    contentElement.closest('.top-header')
  );

  if (isOverContent) {
    updateSpanEffects(x, y);
  } else {
    spans.forEach(span => span.classList.remove('active-touch'));
  }
});
