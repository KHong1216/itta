import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

function getSupabaseHostname() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const supabaseHostname = getSupabaseHostname();

const HTTPS_PROTOCOL: RemotePattern["protocol"] = "https";

const baseRemotePatterns: RemotePattern[] = [
  { protocol: HTTPS_PROTOCOL, hostname: "images.unsplash.com" },
  { protocol: HTTPS_PROTOCOL, hostname: "api.dicebear.com" },
];

const remotePatterns: RemotePattern[] = supabaseHostname
  ? [...baseRemotePatterns, { protocol: HTTPS_PROTOCOL, hostname: supabaseHostname }]
  : baseRemotePatterns;

const nextConfig: NextConfig = {
  swcMinify: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;