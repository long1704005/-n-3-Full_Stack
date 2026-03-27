import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy API → tránh lỗi SSL self-signed khi gọi https://localhost:7217 từ trình duyệt
const apiTarget = process.env.VITE_PROXY_API || 'https://localhost:7217';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
