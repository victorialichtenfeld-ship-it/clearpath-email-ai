/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://clearpath-email-ai.vercel.app',
  },
};
module.exports = nextConfig;
