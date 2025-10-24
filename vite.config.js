import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import * as path from 'path' // 1. Import the 'path' module

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler'],
        ],
      },
    }),
    tailwindcss(),
  ],
  
  // 2. Add the 'resolve' block to define the '@/' alias for Vite
  resolve: {
    alias: {
      // Maps '@/' to the absolute path of the './src' directory
      '@': path.resolve(__dirname, './src'), 
    },
  },
})