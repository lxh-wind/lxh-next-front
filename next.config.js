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
    domains: [
      'placeholder.pics', 
      'avatars.githubusercontent.com'
    ],
  },
  // 使用 rewrite 解决跨域问题
  async rewrites() {
    return [
      {
        source: "/api/:slug*",
        destination: `http://${process.env.PROXY_DOMAIN}.yishou.com/api/:slug*`,
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
  transpilePackages: [
    "openid-client", 
    "antd", 
    "@ant-design/icons", 
    "@ant-design/cssinjs", 
    "@ant-design/nextjs-registry",
    "rc-util"
  ],
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ant-design/cssinjs': '@ant-design/cssinjs/es',
      '@ant-design/nextjs-registry': '@ant-design/nextjs-registry/es',
    };

    // 处理 ES 模块导入问题
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);