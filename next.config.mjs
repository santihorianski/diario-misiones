/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [],
  experimental: {
    serverActions: {
      allowedOrigins: ['misionesya-admin.loca.lt']
    }
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
      { protocol: 'https', hostname: 'utfs.io' }
    ],
  },
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  }
};

export default nextConfig;
