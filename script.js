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


// HANDLE MOUSE MOVE (FOR DESKTOP TOUCH SIMULATION) //
// document.addEventListener('mousemove', (e) => {
//   // Only apply on touch devices or when not in focus area
//   if (window.innerWidth < 1024) {
//     updateSpanEffects(e.clientX, e.clientY);
//   }
// });

function updateSpanEffects(x, y) {
  spans.forEach(span => {
    const rect = span.getBoundingClientRect();
    const spanCenterX = rect.left + rect.width / 2;
    const spanCenterY = rect.top + rect.height / 2;

    // Calculate distance from touch point to span center
    const distance = Math.hypot(x - spanCenterX, y - spanCenterY);

    // Apply effect to spans within a certain radius
    const radius = 50; // pixels

    if (distance < radius) {
      span.classList.add('active-touch');
    } else {
      span.classList.remove('active-touch');
    }
  });
}

// Optional: Prevent default touch behaviors for better UX
document.addEventListener('touchmove', function (e) {
  // Allow scrolling but enhance interactivity
}, { passive: true });
