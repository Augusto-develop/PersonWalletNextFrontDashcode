// import createNextIntlPlugin from "next-intl/plugin";

// /** @type {import('next').NextConfig} */

// const withNextIntl = createNextIntlPlugin();

// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "api.lorem.space",
//       },
//       {
//         protocol: "https",
//         hostname: "lh3.googleusercontent.com",
//       },
//       {
//         protocol: "https",
//         hostname: "a0.muscache.com",
//       },
//       {
//         protocol: "https",
//         hostname: "avatars.githubusercontent.com",
//       },
//       {
//         protocol: "https",
//         hostname: "i.pravatar.cc",
//       },
//     ],
//   },
//   reactStrictMode: true,
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       config.watchOptions = {
//         poll: 1000, // Verifica mudanças a cada 1 segundo
//         aggregateTimeout: 300,
//       };
//     }
//     return config;
//   },
// };

// export default withNextIntl(nextConfig);

/** @type {import('next').NextConfig} */
const nextConfig = {  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.lorem.space",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "a0.muscache.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        poll: 1000, // Verifica mudanças a cada 1 segundo
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  env: {
    TZ: "America/Sao_Paulo", // Define o fuso horário para a aplicação
  },
};

export default nextConfig;
