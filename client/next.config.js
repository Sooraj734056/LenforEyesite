/** @type {import('next').NextConfig} */
const fallbackApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

let apiOrigin = 'http://localhost:5000';
let uploadsPattern = { protocol: 'http', hostname: 'localhost', port: '5000', pathname: '/uploads/**' };

try {
  const parsedApiUrl = new URL(fallbackApiUrl);
  apiOrigin = parsedApiUrl.origin;
  uploadsPattern = {
    protocol: parsedApiUrl.protocol.replace(':', ''),
    hostname: parsedApiUrl.hostname,
    port: parsedApiUrl.port,
    pathname: '/uploads/**'
  };
} catch (_) {}

const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'placehold.co'],
    remotePatterns: [
      uploadsPattern
    ]
  },
  env: {
    NEXT_PUBLIC_API_URL: fallbackApiUrl,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${apiOrigin}/api/:path*` }
    ];
  }
};

module.exports = nextConfig;
