// Simple script to set environment variables and start the dev server
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { config } from 'dotenv';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envPath = resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  config({ path: envPath });
} else {
  // Set default environment variables if .env doesn't exist
  process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_2ATlFJ3PSKxm@ep-withered-grass-a5ctcccf-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require';
  process.env.NODE_ENV = 'development';
}

// Start the dev server
const dev = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: process.env
});

dev.on('close', (code) => {
  process.exit(code);
}); 