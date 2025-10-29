import { defineConfig } from 'vite';


export default defineConfig({
  // **Crucial for Vercel deployment of static sites**
  // This sets the base URL for the built assets.
  // Using '/' ensures that assets are resolved relative to the root of the domain (e.g., https://your-app.vercel.app/src/main.ts)
  // instead of a hardcoded 'http://localhost:3000/...' path.
  base: '/',

  // Add this 'server' configuration block
  server: {
    // This explicitly tells the development server what MIME types to use
    // for common script files, resolving the 'video/mp2t' error.
    mimeTypes: {
      'application/javascript': ['js', 'ts'],
    },
  },

  // Configuration for the build step
  build: {
    // Specify the directory where the production files will be output
    outDir: 'dist',

    // Set the assets path, which helps resolve paths like /src/assets/images/header.png
    // assetsDir: 'public',

    // Define entry points if needed, though usually not necessary for a standard index.html setup
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
});