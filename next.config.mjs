import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production build settings
  productionBrowserSourceMaps: false,
  
  // Turbopack configuration
  turbopack: {
    root: __dirname,
  },
  
  // Webpack configuration for both dev and production
  webpack: (config, { dev, isServer }) => {
    // Disable source maps in development to avoid warnings
    if (dev) {
      config.devtool = false;
    }
    return config;
  },
  
  // Output configuration for Vercel deployment
  output: 'standalone',
};

export default nextConfig;