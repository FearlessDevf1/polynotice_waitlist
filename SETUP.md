# PolyNotice Landing Page Setup Guide

## Overview

This is the official landing page for PolyNotice - a trading intelligence platform for prediction market traders.

**Key Features:**
- Clean, modern SaaS-style design
- Block-based UI system with consistent spacing
- Working waitlist with email deduplication
- Fully responsive on all devices
- Dark theme with blue accent color
- Smooth animations and transitions

## Prerequisites

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache, Nginx, etc.)
- Node.js (optional, for development)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/FearlessDevf1/polynotice-landingpage.git
cd polynotice-landingpage
```

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your database credentials
nano .env  # or use your editor
```

### 3. Create Database

```bash
# Login to MySQL
mysql -u root -p

# Run the schema
mysql -u root -p < schema.sql
```

Or import `schema.sql` through phpMyAdmin.

### 4. Update File Permissions

```bash
# Make sure the directory is writable
chmod -R 755 /path/to/polynotice-landingpage
```

### 5. Access the Page

```
http://localhost/polynotice-landingpage/landing.html
```

or if you're using PHP's built-in server:

```bash
php -S localhost:8000
# Then visit: http://localhost:8000/landing.html
```

## File Structure

```
polynotice-landingpage/
├── landing.html          # Main landing page
├── landing.css           # Block-based CSS with animations
├── landing.js            # JavaScript interactions & form handling
├── waitlist.php          # Backend API for email collection
├── schema.sql            # Database schema
├── .env.example          # Environment configuration template
├── README.md             # Project documentation
└── images/               # Image assets
```

## Block System Architecture

The landing page uses a strict block-based design system:

### Block Specifications
- **Padding:** `1.5rem` (var(--spacing-xl))
- **Border Radius:** `1.5rem` (var(--radius-lg))
- **Border:** `1px solid rgba(255, 255, 255, 0.1)`
- **Background:** `#0a0a0a` (var(--color-card))
- **Hover Effect:** Subtle blue glow with border color change

### Color Palette
- **Background:** `#000000` (pure black)
- **Card Background:** `#0a0a0a`
- **Primary Color:** `#3B82F6` (blue)
- **Text:** `#ffffff`
- **Text Muted:** `#a0a0a0`
- **Border:** `rgba(255, 255, 255, 0.1)`

## Sections

### Header
- Sticky navigation with logo
- Links to Roadmap, Features, Docs
- CTA button for joining waitlist
- Logo has built-in hover animation

### Hero Section
- Large, impactful headline
- Subheading with clear value proposition
- Two CTA buttons (primary, secondary)
- Stats showcase below CTAs

### Features Section
- Grid of 6 feature cards
- Equal sizing and spacing
- Consistent card styling
- Staggered animation on page load

### Roadmap Section
- 4 development phases
- Each phase in its own block
- Consistent spacing and layout
- Check marks for features

### Waitlist Section
- Center-aligned form
- Email input with validation
- Loading, success, and error states
- Benefits list below form
- Gradient background for emphasis

### Footer
- Multiple sections (Product, Links, Legal)
- Links to Docs, Roadmap, Twitter, Email
- Legal text and disclaimers

## Animations

All animations use a consistent system:

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Staggered Delays
- First element: 0ms
- Second element: 100ms
- Third element: 200ms
- And so on...

This creates a cascading effect as the page loads.

## Waitlist API

### Endpoint
```
POST /waitlist.php
```

### Request
```json
{
  "email": "user@example.com"
}
```

### Response (Success)
```json
{
  "success": true,
  "message": "Successfully added to waitlist",
  "id": 1,
  "email": "user@example.com",
  "timestamp": "2024-03-29 10:30:00"
}
```

### Response (Error)
```json
{
  "success": false,
  "message": "This email is already on the waitlist",
  "timestamp": "2024-03-29 10:30:00"
}
```

## Database Tables

### waitlist
- `id` - Primary key
- `email` - User email (unique)
- `ip_address` - IP of subscriber
- `user_agent` - Browser information
- `referral_source` - Where they came from
- `status` - pending/confirmed/unsubscribed
- `created_at` - Timestamp
- `updated_at` - Last update timestamp

### page_views
- Tracks landing page analytics

### feedback
- Stores user feedback messages

### feature_requests
- Community feature request voting

## Email Configuration (Optional)

To enable confirmation emails:

1. Set `ENABLE_EMAIL_CONFIRMATION=true` in `.env`
2. Configure SMTP settings
3. Uncomment the `mail()` call in `waitlist.php`

For Gmail:
- Use [App Passwords](https://support.google.com/accounts/answer/185833)
- Update MAIL_USERNAME and MAIL_PASSWORD in `.env`

## Responsive Design

The page is fully responsive:

- **Desktop (> 900px):** Full layout with all features
- **Tablet (600-900px):** Adjusted spacing and grid
- **Mobile (< 600px):** Single column layout, optimized buttons

## Customization

### Changing Colors

Edit `:root` variables in `landing.css`:

```css
:root {
  --color-primary: #3B82F6;      /* Change primary color */
  --color-bg: #000000;            /* Change background */
  --color-card: #0a0a0a;          /* Change card background */
}
```

### Adding Sections

1. Create a new section in HTML
2. Add styling matching the block system
3. Add animation delays
4. Ensure responsive behavior

### Modifying Content

All text content is in `landing.html`. Simply edit the copy:

```html
<h1 class="hero-title">Your New Title</h1>
```

## Performance

### Optimizations Included
- Lazy loading for images
- Smooth transitions with GPU acceleration
- Minimal CSS (no frameworks)
- Vanilla JavaScript (no dependencies)
- Efficient form validation
- Database indexes on frequently queried fields

### Best Practices
1. Minify CSS and JS in production
2. Enable gzip compression
3. Use a CDN for static assets
4. Set up proper database backups
5. Use HTTPS in production

## Deployment

### Using Shared Hosting

1. Upload files via FTP
2. Import `schema.sql` through phpMyAdmin
3. Update `waitlist.php` database credentials
4. Point domain to the folder
5. Test the waitlist form

### Using Docker (Optional)

```dockerfile
FROM php:7.4-apache
RUN docker-php-ext-install mysqli pdo pdo_mysql
COPY . /var/www/html/
```

### Deploy to Production Checklist

- [ ] Set `APP_ENV=production` in `.env`
- [ ] Disable error display in PHP
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Test all forms and links
- [ ] Verify mobile responsiveness
- [ ] Set up monitoring/logging
- [ ] Get SSL certificate (Let's Encrypt)

## Troubleshooting

### Whitelist Form Not Working

**Check:**
1. Is PHP installed and running?
2. Is MySQL database accessible?
3. Does the database have the waitlist table?
4. Check browser console for JavaScript errors
5. Check PHP error logs

### Database Connection Failed

```bash
# Verify credentials in .env
# Check MySQL is running
mysql -u root -p -e "SELECT 1"
```

### CSS Not Loading

- Check file path in HTML
- Ensure web server is serving static files
- Clear browser cache

## Support & Feedback

- **Email:** polynotice@gmail.com
- **Twitter:** https://x.com/PolyNotice
- **Issues:** GitHub Issues (if public)

## License

See LICENSE file for details.

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Changelog

### Version 1.0
- Initial launch
- Block-based design system
- Waitlist collection
- Responsive mobile design
- Smooth animations
