// Smooth animations on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeAnimations();
  initializeWaitlist();
  initializeScrollEffects();
});

// ==================== ANIMATIONS ====================
function initializeAnimations() {
  // Add animation classes to elements
  const sections = document.querySelectorAll('section');
  const featureCards = document.querySelectorAll('.feature-card');
  const roadmapPhases = document.querySelectorAll('.roadmap-phase');

  // Feature cards get staggered animation
  featureCards.forEach((card, index) => {
    card.classList.add('animate-in');
  });

  // Roadmap phases get staggered animation
  roadmapPhases.forEach((phase, index) => {
    phase.classList.add('animate-in');
  });

  // Trigger animations
  setTimeout(() => {
    document.querySelectorAll('.animate-in').forEach(el => {
      el.style.opacity = '1';
    });
  }, 100);
}

// ==================== SCROLL EFFECTS ====================
function initializeScrollEffects() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });
}

// ==================== WAITLIST FORM ====================
function initializeWaitlist() {
  const form = document.getElementById('waitlistForm');
  const emailInput = document.getElementById('emailInput');
  const formMessage = document.getElementById('formMessage');
  const heroBtn = document.getElementById('heroWaitlistBtn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = emailInput.value.trim();

      // Validation
      if (!email) {
        showMessage(formMessage, 'Please enter an email address', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showMessage(formMessage, 'Please enter a valid email address', 'error');
        return;
      }

      // Submit to backend
      await submitWaitlist(email, form, emailInput, formMessage);
    });
  }

  // Hero button scroll to waitlist
  if (heroBtn) {
    heroBtn.addEventListener('click', () => {
      const waitlistSection = document.getElementById('waitlist');
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
      emailInput?.focus();
    });
  }
}

async function submitWaitlist(email, form, emailInput, messageEl) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  try {
    // Show loading state
    submitBtn.disabled = true;
    showMessage(messageEl, 'Joining waitlist...', 'loading');

    const response = await fetch('waitlist.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `email=${encodeURIComponent(email)}`
    });

    const data = await response.json();

    if (data.success) {
      showMessage(messageEl, '✓ Successfully joined! Check your email for updates.', 'success');
      emailInput.value = '';
      submitBtn.textContent = 'Joined!';
      
      // Reset after 3 seconds
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        messageEl.textContent = '';
      }, 3000);
    } else {
      const errorMsg = data.message || 'Something went wrong. Please try again.';
      showMessage(messageEl, errorMsg, 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  } catch (error) {
    console.error('Waitlist error:', error);
    showMessage(messageEl, 'Connection error. Please try again.', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `form-message ${type}`;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ==================== SCROLL TO SECTION ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Skip if not a valid section link
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==================== DARK MODE SUPPORT ====================
// Check system preference and apply
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.setAttribute('data-theme', 'dark');
}

// Listen for changes
window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
  document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
});

// ==================== UTILITY FUNCTIONS ====================

// Add visual feedback to buttons
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousedown', function() {
    this.style.transform = 'scale(0.98)';
  });
  
  btn.addEventListener('mouseup', function() {
    this.style.transform = '';
  });
  
  btn.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  // Escape key closes any open modals/messages
  if (e.key === 'Escape') {
    document.querySelectorAll('.form-message').forEach(msg => {
      if (msg.textContent) {
        msg.textContent = '';
        msg.className = 'form-message';
      }
    });
  }
});

// Performance: Lazy load images if any
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Prevent multiple rapid submissions
let isSubmitting = false;

document.addEventListener('submit', (e) => {
  if (isSubmitting) {
    e.preventDefault();
    return;
  }
  
  isSubmitting = true;
  setTimeout(() => {
    isSubmitting = false;
  }, 1000);
});
