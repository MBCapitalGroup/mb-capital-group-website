// Simple Node.js server for Render deployment
// This bypasses all TypeScript compilation issues

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'mb-capital-session-secret-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Simple user storage (matches your working system)
const users = new Map();
users.set('admin', {
  id: 10,
  username: 'admin', 
  password: '$2b$10$Scrappy2025Bachmann##hashed'
});

// Passport strategy
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

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-login.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

// API routes
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
      city: "Kansas City",
      state: "MO", 
      averageRent: 1250,
      occupancyRate: 94.5,
      marketData: { population: 508000, medianIncome: 52000 }
    }
  ]);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`MB Capital Group server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});