/** @type {import('next').NextConfig} */
// Single merged app: landing at "/", cosmetics at "/cosmetics", grains at "/grains".
// No basePath here — each section is a folder under src/app with its own root
// layout, and the old cross-port rewrites (landing -> localhost:3001) are gone.
const nextConfig = {
  reactCompiler: true,
};

export default nextConfig;
