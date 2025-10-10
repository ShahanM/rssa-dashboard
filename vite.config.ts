import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: '/rssa-dashboard/',
    server: {
        port: 3339,
        open: '/rssa-dashboard/',
    },
});
