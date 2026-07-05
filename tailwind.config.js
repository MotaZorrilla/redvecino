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
                outfit: ['Outfit', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    navy: '#0F2557',
                    teal: '#00A896',
                    green: '#72B043',
                    orange: '#EC7A08',
                    purple: '#7A5299',
                    gray: '#E2E8F0',
                    success: '#72B043',
                    warning: '#EC7A08',
                    error: '#0F2557',
                    info: '#00A896',
                    'navy-dark': '#0A183A',
                    'teal-light': '#00c2ad',
                    'green-dark': '#629b37',
                    'bg-primary': '#090d16',
                    'bg-secondary': '#0f1524',
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
            borderRadius: {
                'card': '1rem',
                'modal': '1.5rem',
                'pill': '9999px',
                'btn': '0.75rem',
            },
            boxShadow: {
                'brand-sm': '0 1px 3px 0 rgba(15,37,87,0.08)',
                'brand-md': '0 4px 6px -1px rgba(15,37,87,0.1)',
                'brand-lg': '0 10px 15px -3px rgba(15,37,87,0.12)',
                'brand-teal': '0 4px 14px -2px rgba(0,168,150,0.2)',
                'brand-green': '0 4px 14px -2px rgba(114,176,67,0.2)',
            },
            zIndex: {
                'dropdown': '50',
                'sticky': '60',
                'sidebar': '70',
                'modal-backdrop': '80',
                'modal': '90',
                'toast': '100',
                'tooltip': '110',
            },
            backdropBlur: {
                'xs': '2px',
                'sm': '4px',
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
