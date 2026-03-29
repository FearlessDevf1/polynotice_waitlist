# 🚀 PolyNotice Landing Page

**Production-Ready Trading Intelligence Platform Landing Page**

A clean, modern SaaS landing page built with a strict block-based design system, featuring real-time form handling, responsive mobile design, and smooth animations.

## About PolyNotice

PolyNotice is a trading intelligence platform built for prediction market traders. It helps users stay ahead by providing real-time alerts, trade monitoring, and automation tools designed for platforms like Polymarket.

**PolyNotice aims to solve a major problem in prediction markets: lack of trade alerts and automation.**

The platform allows traders to:
- Receive price alerts on market movements
- Monitor active trades and portfolio positions
- Set take-profit and stop-loss alerts
- Track top performing accounts
- Discover trading signals
- Automate certain trading actions when away

## Landing Page Features

### ✨ Design & Technology
- **Block-Based UI System** - Consistent spacing, padding, borders, and hover effects
- **Dark Theme** - Pure black background with subtle dark cards and blue accents
- **Smooth Animations** - Fade + translate with staggered cascade delays
- **Fully Responsive** - Mobile-first design optimized for all screen sizes
- **Zero Dependencies** - Vanilla HTML, CSS, and JavaScript
- **Production Ready** - includes form validation, error handling, and security

### 📄 Page Sections
1. **Header** - Sticky navigation with logo and internal/external links
2. **Hero** - Powerful headline with dual CTAs (Join Waitlist, View Docs)
3. **Features** - 6 equal-sized cards showcasing core capabilities
4. **Roadmap** - 4 development phases with detailed features
5. **Waitlist** - Email collection form with validation and duplicate prevention
6. **Footer** - Documentation links, social media, email, and legal text

### 🔧 Functionality
✅ Email validation (client & server-side)  
✅ Duplicate email prevention (database)  
✅ Loading, success, and error states  
✅ Smooth scroll navigation  
✅ Form submission with feedback  
✅ Analytics schema (ready for implementation)  
✅ Security best practices (prepared statements, input sanitization)  

## 🚀 Quick Start

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache, Nginx) or use PHP's built-in server

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/FearlessDevf1/polynotice-landingpage.git
cd polynotice-landingpage

# 2. Run the automated setup
bash setup.sh

# 3. Create the database
mysql -u root -p < schema.sql

# 4. Configure .env
cp .env.example .env
# Edit .env with your database credentials

# 5. Start development server
php -S localhost:8000

# 6. Open in browser
# http://localhost:8000/landing.html
```

For detailed setup and deployment instructions, see [SETUP.md](SETUP.md).

## 📁 Project Structure

```
polynotice-landingpage/
├── landing.html           # Main landing page HTML
├── landing.css            # Block-based responsive styles
├── landing.js             # Form handling & interactions
├── waitlist.php           # Email collection API
├── schema.sql             # Database tables & structure
├── SETUP.md              # Complete setup & deployment guide
├── setup.sh              # Automated setup script
├── .env.example          # Environment configuration template
├── .gitignore            # Git ignore rules
├── images/               # Image assets directory
└── README.md             # This file
```

## 🎨 Design System

### Block Specifications
All UI elements follow a consistent block pattern:
- **Padding:** 1.5rem (CSS: `--spacing-xl`)
- **Border Radius:** 1.5rem (CSS: `--radius-lg`)
- **Border:** 1px solid rgba(255, 255, 255, 0.1)
- **Background:** #0a0a0a
- **Hover Effect:** Subtle blue glow with border color shift

### Color Palette
| Token | Hex Code | Use Case |
|-------|----------|----------|
| Primary | #3B82F6 | Interactive buttons, highlights |
| Background | #000000 | Page background |
| Card | #0a0a0a | Block/card backgrounds |
| Text | #ffffff | Headlines and copy |
| Muted Text | #a0a0a0 | Secondary text |
| Border | rgba(255,255,255,0.1) | Block borders |

### Responsive Breakpoints
| Breakpoint | Device | Layout |
|-----------|--------|--------|
| < 480px | Mobile | Single column, optimized buttons |
| 480-768px | Tablet | Stacked layout, reduced spacing |
| 768-1200px | Small Desktop | 2-3 column grid |
| > 1200px | Desktop | Full multi-column layout |

## 📊 Database Schema

### Waitlist Table
```sql
id              INT AUTO_INCREMENT PRIMARY KEY
email           VARCHAR(255) NOT NULL UNIQUE
ip_address      VARCHAR(45)
user_agent      TEXT
referral_source VARCHAR(100)
status          ENUM('pending', 'confirmed', 'unsubscribed')
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

Additional tables included for future use: `page_views`, `feedback`, `feature_requests`

## 🔄 API Endpoint

### Submit Email to Waitlist

**Endpoint:** `POST /waitlist.php`

**Request:**
```javascript
{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Successfully added to waitlist",
  "id": 1,
  "email": "user@example.com",
  "timestamp": "2024-03-29 10:30:00"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "This email is already on the waitlist",
  "timestamp": "2024-03-29 10:30:00"
}
```

## 🎯 Animation System

All animations use consistent easing functions and staggered timing:

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Stagger Pattern:**
- Element 1: 0ms delay
- Element 2: 100ms delay
- Element 3: 200ms delay
- Continues incrementally for cascading effect

## 🔐 Security Features

✅ **Input Validation**
- Client-side email format validation
- Server-side comprehensive validation
- Input trimming and sanitization

✅ **SQL Injection Prevention**
- Prepared statements with parameterized queries
- No string concatenation in SQL
- Proper parameter binding

✅ **Data Protection**
- UNIQUE email constraint (no duplicates)
- IP and user-agent tracking
- Error logging (not exposed to users)
- Timestamp auditing

## 🛠️ Deployment

### Shared Hosting
1. Upload files via FTP
2. Import schema.sql through phpMyAdmin
3. Update database credentials in .env
4. Configure domain pointing
5. Enable HTTPS/SSL

### Docker (Optional)
See SETUP.md for Docker configuration example.

### Production Checklist
- [ ] Set APP_ENV=production in .env
- [ ] Disable PHP error display
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure automated database backups
- [ ] Set up error logging
- [ ] Test all forms and links
- [ ] Verify mobile responsiveness
- [ ] Enable gzip compression

See [SETUP.md](SETUP.md) for complete deployment guide.

## 📱 Responsive Test

The landing page is optimized for:
- ✅ iPhone, iPad & tablets
- ✅ Android phones & tablets
- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)
- ✅ 320px - 1920px+ screen widths

## 🚀 Project Status

PolyNotice is currently in **early development**. This landing page serves as the public entry point while the core platform is being built.

### Upcoming Features
- Alert system for prediction market trades
- Advanced portfolio monitoring tools
- Smart signals and account tracking
- Automation features for trade management
- API access for developers

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Installation, configuration, and deployment
- **[schema.sql](schema.sql)** - Database structure reference
- **[landing.js](landing.js)** - JavaScript code documentation
- **[landing.css](landing.css)** - CSS variable and class reference

## 🔗 Links

- **Docs:** https://docs.polynotice.com
- **Twitter/X:** https://x.com/PolyNotice
- **Email:** polynotice@gmail.com
- **Website:** Coming Soon

## ⚖️ Disclaimer

**PolyNotice does not provide financial advice.**

All tools are designed to assist users in monitoring and managing their own trading strategies. Past performance is not indicative of future results. Always conduct your own due diligence before trading.

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Made for traders, by traders. Trading intelligence for prediction markets. 🚀**
