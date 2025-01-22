import * as Sentry from "@sentry/nestjs";
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from "node:fs";

const envPath = path.resolve(__dirname, '..', '.env');
console.log('Attempting to load .env file from:', envPath);

if (fs.existsSync(envPath)) {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.error('Error loading .env file:', result.error);
  } else {
    console.log('.env file loaded successfully');
  }
} else {
  console.warn('.env file does not exist, skipping dotenv configuration');
}

console.log('SENTRY_DSN:', process.env.SENTRY_DSN);

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  debug: true,
});
