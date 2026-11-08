import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  typedRoutes: true,
  outputFileTracingIncludes: {
    "/api/*": ["./prisma/demo.db"],
  },
};
export default nextConfig;
