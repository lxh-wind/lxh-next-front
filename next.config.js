const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const isProd =
  process.env.APP_ENV === "production" || process.env.APP_ENV === "staging";
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    loader: "default",
    path: "/",
  },
  // 使用 rewrite 解决跨域问题
  async rewrites() {
    return [
      {
        source: "/api/:slug*",
        destination: `http://${process.env.PROXY_DOMAIN}.yishou.com/api/:slug*`,
        // destination: `http://${process.env.PROXY_DOMAIN}.yishouapp.com/api/:slug*`, // 对外网联调，使用test.yishouapp.com
      },
    ];
  },
  compiler: {
    removeConsole: isProd
      ? {
          exclude: ["error", "warn"],
        }
      : false,
  },
  transpilePackages: ["openid-client"],
  // Add experimental configuration for ESM packages
  experimental: {
    serverComponentsExternalPackages: ["@kubernetes/client-node"],
  },
};

module.exports = withBundleAnalyzer(nextConfig);