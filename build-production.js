#!/usr/bin/env node

// Build script for production deployment
// This handles TypeScript compilation and asset preparation

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🏗️  Starting production build...');

// Create dist directory
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Build server (TypeScript to JavaScript)
console.log('📦 Compiling server...');
try {
  execSync('npx tsc server/index.ts --outDir dist --target es2022 --module es2022 --moduleResolution node --esModuleInterop --allowSyntheticDefaultImports --strict --skipLibCheck', {
    stdio: 'inherit'
  });
  console.log('✅ Server compiled successfully');
} catch (error) {
  console.error('❌ Server compilation failed:', error.message);
  process.exit(1);
}

// Copy static files
console.log('📁 Copying static files...');
const filesToCopy = [
  'index.html',
  'investor-portal.html',
  'investor-portal-login.html',
  'investor-portal-register.html',
  'investor-registration.html',
  'tax-calculator.html'
];

filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('dist', file));
    console.log(`✅ Copied ${file}`);
  }
});

// Copy directories
const dirsToCopy = ['uploads', 'team-photos', 'assets'];
dirsToCopy.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.cpSync(dir, path.join('dist', dir), { recursive: true });
    console.log(`✅ Copied ${dir}/ directory`);
  }
});

// Create package.json for production
const productionPackage = {
  "name": "mb-capital-group-production",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
};

fs.writeFileSync(
  path.join('dist', 'package.json'), 
  JSON.stringify(productionPackage, null, 2)
);

console.log('🎉 Production build complete!');
console.log('📁 All files ready in dist/ directory');
console.log('🚀 Ready for deployment to Render, Railway, or Vercel');