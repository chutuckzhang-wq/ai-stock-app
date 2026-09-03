import type { NextConfig } from "next";
// @ts-expect-error - next-pwa does not have TypeScript types built-in
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  // Any existing Next.js config goes here
};

export default withPWA(nextConfig);