/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cloud.appwrite.io", "links.papareact.com"],
  },
  env: {
    BUCKET_ID:process.env.BUCKET_ID,
  }
};

module.exports = nextConfig;
