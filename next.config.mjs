/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: [
      "wallpapers.com",
      "images.unsplash.com",
      "res.cloudinary.com",
      "xsgames.co",
      "i.pinimg.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
  },
  publicRuntimeConfig: {
    // Exposing pusher env variables to the client
    PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
    PUSHER_APP_CLUSTER: process.env.PUSHER_APP_CLUSTER,
  },
};

export default config;
