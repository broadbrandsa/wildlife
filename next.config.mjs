/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        // Species card photography is hotlinked from Wikimedia Commons for the
        // prototype (each URL carries its own CC licence; attribution is noted
        // in src/data/species.ts and must be surfaced before production).
        remotePatterns: [{ protocol: "https", hostname: "upload.wikimedia.org" }],
    },
};

export default nextConfig;
