/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const ContentSecurityPolicy = `
  default-src 'self';
  img-src 'self' data: https://d3b0mex1n5da6k.cloudfront.net;
  script-src 'self' 'unsafe-eval' https://api.mapbox.com https://accounts.google.com/gsi/client https://connect.facebook.net/en_US/sdk.js;
  connect-src 'self' http://localhost:3010 ws://localhost:3000 https://l2go.trydemo.dev https://api.mapbox.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  `;

const nextConfig = {
  publicRuntimeConfig: {
    baseApiUrl: process.env.BASE_API_URL,
    baseFileUrl: process.env.BASE_FILE_URL,
    mapboxToken: process.env.MAPBOX_TOKEN,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    facebookClientId: process.env.FACEBOOK_CLIENT_ID,
  },

  reactStrictMode: true,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
