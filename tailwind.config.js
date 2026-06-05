import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    navy: '#0F2557',
                    teal: '#00A896',
                    green: '#72B043',
                    orange: '#EC7A08',
                    purple: '#7A5299',
                    gray: '#E2E8F0',
                },
                slate: {
                    350: '#c8d0db',
                    355: '#c0c8d4',
                    505: '#64748b',
                    550: '#566276',
                    650: '#3b4559',
                    850: '#111827',
                },
                gray: {
                    150: '#e8eaed',
                },
                indigo: {
                    650: '#4555b0',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'spin-slow': 'spin 3s linear infinite',
                'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
                'scale-98': 'scale98 0.15s ease-in-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseSubtle: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                scale98: {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(0.98)' },
                },
            },
        },
    },

    plugins: [forms],
};
