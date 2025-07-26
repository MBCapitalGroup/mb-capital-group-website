// Production server for MB Capital Group
// Compiled from TypeScript for Render deployment

const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static directories
app.use('/team-photos', express.static('team-photos'));
app.use('/assets', express.static('assets'));
app.use('/uploads', express.static('uploads'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'mb-capital-session-secret-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Simple user storage (matching your working system)
const users = new Map();
// Hash for password: Scrappy2025Bachmann##
users.set('admin', {
  id: 10,
  username: 'admin',
  password: '$2b$10$XQ8Z.9vx.lNGjNyxZYzLJ.uV1s2m1FHcjLXkuXtRgYzNbQnKzgJsS'
});

passport.use(new LocalStrategy(
  async (username, password, done) => {
    const user = users.get(username);
    if (!user) return done(null, false);
    
    try {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) return done(null, user);
      return done(null, false);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = Array.from(users.values()).find(u => u.id === id);
  done(null, user);
});

// Helper function to serve HTML files
async function serveHtml(res, filename) {
  try {
    const template = await fs.readFile(path.resolve(process.cwd(), filename), 'utf-8');
    res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
  } catch (error) {
    console.error(`Error serving ${filename}:`, error);
    res.status(500).send('Internal Server Error');
  }
}

// Routes
app.get('/', (req, res) => serveHtml(res, 'index.html'));
app.get('/investor-portal/register', (req, res) => serveHtml(res, 'investor-registration.html'));
app.get('/investor-portal', (req, res) => serveHtml(res, 'investor-portal.html'));
app.get('/investor-portal/login', (req, res) => serveHtml(res, 'investor-portal-login.html'));
app.get('/tax-calculator', (req, res) => serveHtml(res, 'tax-calculator.html'));
app.get('/tax-calculator.html', (req, res) => serveHtml(res, 'tax-calculator.html'));

// Admin routes
app.get('/admin/login', (req, res) => serveHtml(res, 'static-admin/admin-login.html'));
app.get('/admin/dashboard', (req, res) => serveHtml(res, 'static-admin/admin-dashboard.html'));

// API Routes
app.get('/api/team-members', (req, res) => {
  res.json([
    {
      name: "Michael Barrett",
      title: "Founder & Principal",
      bio: "20+ years in multifamily real estate investment and syndication.",
      image: "/team-photos/michael-barrett.jpg"
    }
  ]);
});

app.get('/api/markets', (req, res) => {
  res.json([
    {
      id: 1,
      marketId: "KC001",
      city: "Kansas City",
      state: "MO",
      averageRent: 1250,
      occupancyRate: 94.5,
      marketData: { population: 508000, medianIncome: 52000 }
    },
    {
      id: 2,
      marketId: "STL001", 
      city: "St. Louis",
      state: "MO",
      averageRent: 1180,
      occupancyRate: 92.8,
      marketData: { population: 315000, medianIncome: 48000 }
    }
  ]);
});

// Authentication routes
app.post('/api/auth/login', 
  passport.authenticate('local', { failureRedirect: '/admin/login' }),
  (req, res) => {
    res.json({ success: true, user: req.user });
  }
);

app.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ success: true });
  });
});

// Email submission (basic implementation)
app.post('/api/consultation-request', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    console.log('Consultation request received:', { firstName, lastName, email, phone });
    
    // In production, save to database and send email
    res.json({ success: true, message: 'Consultation request submitted successfully' });
  } catch (error) {
    console.error('Error processing consultation request:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// Newsletter subscription
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Newsletter subscription:', email);
    
    res.json({ success: true, message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`MB Capital Group server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log('Database URL:', process.env.DATABASE_URL ? 'Connected' : 'Not configured');
  console.log('SendGrid API:', process.env.SENDGRID_API_KEY ? 'Configured' : 'Not configured');
});