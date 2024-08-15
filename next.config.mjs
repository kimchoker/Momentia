/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Enable WebAssembly support
    config.experiments = {
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,  // Enable the layers experiment
    };

    // Add a rule to handle .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // Ensure '.wasm' is added to the extensions list
    config.resolve.extensions.push('.wasm');

    return config;
  },
};

export default nextConfig;

