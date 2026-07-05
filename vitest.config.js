import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './resources/js/test-setup.js',
        css: false,
        include: ['resources/js/**/*.test.{js,jsx}'],
    },
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});
