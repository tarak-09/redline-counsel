/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // pdfjs-dist uses browser APIs — keep it out of the server bundle entirely
      const existing = Array.isArray(config.externals) ? config.externals : []
      config.externals = [...existing, 'pdfjs-dist']
    } else {
      // pdfjs-dist tries to require 'canvas' in Node environments — stub it out
      config.resolve.alias = { ...config.resolve.alias, canvas: false }
    }
    return config
  },
}

export default nextConfig
