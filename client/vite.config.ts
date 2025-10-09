import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { z } from 'zod';

// Plugin to resolve Next.js imports to our shims
function nextJsShimsPlugin(): Plugin {
  return {
    name: 'nextjs-shims',
    enforce: 'pre',
    resolveId(id) {
      if (id === 'next/navigation') {
        return path.resolve(__dirname, './src/shims/next-navigation.ts');
      }
      if (id === 'next/headers') {
        return path.resolve(__dirname, './src/shims/next-headers.ts');
      }
      if (id === 'next/link') {
        return path.resolve(__dirname, './src/shims/next-link.tsx');
      }
      if (id === 'next/router') {
        return path.resolve(__dirname, './src/shims/next-router.ts');
      }
      if (id === 'next/image') {
        return path.resolve(__dirname, './src/shims/next-image.tsx');
      }
      return null;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables based on the current mode
  const raw = loadEnv(mode, process.cwd(), '');
  const VITE_API_URL = raw.VITE_API_URL || 'http://localhost:3001';
  const VITE_CLERK_PUBLISHABLE_KEY = raw.VITE_CLERK_PUBLISHABLE_KEY || '';

  // Optional: warn if provided API URL is not a valid URL
  try {
    if (raw.VITE_API_URL) {
      z.string().url().parse(raw.VITE_API_URL);
    }
  } catch {
    console.warn('VITE_API_URL is not a valid URL; defaulting to http://localhost:3001');
  }

  return {
    plugins: [nextJsShimsPlugin(), react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/core/ui': path.resolve(__dirname, './src/ui'),
        'next/link': path.resolve(__dirname, './src/shims/next-link.tsx'),
        'next/router': path.resolve(__dirname, './src/shims/next-router.ts'),
        'next/image': path.resolve(__dirname, './src/shims/next-image.tsx'),
        'next/navigation': path.resolve(__dirname, './src/shims/next-navigation.ts'),
        'next/headers': path.resolve(__dirname, './src/shims/next-headers.ts'),
        'next/dist/build/output/log': path.resolve(__dirname, './src/shims/next-log.ts'),
      },
    },
    build: {
      rollupOptions: {
        // Don't externalize - we provide shims for these
      },
    },
    server: {
      port: 3000,
      open: true,
      host: true, // Allow external connections
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        '192.168.20.28',
        'int-joy-baking-yield.trycloudflare.com',
        '.trycloudflare.com', // Allow any trycloudflare.com subdomain
      ],
      proxy: {
        '/api': {
          target: VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port: 3000,
      open: true,
    },
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version),
      'import.meta.env.VITE_API_URL': JSON.stringify(VITE_API_URL),
      'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(VITE_CLERK_PUBLISHABLE_KEY),
    },
  };
});
