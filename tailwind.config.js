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
                    navy: '#0F2557',     // RedVecino Dark Navy
                    teal: '#00A896',     // RedVecino/MiVecino Teal
                    green: '#72B043',    // MiVecino Green
                    orange: '#EC7A08',   // MiVecino Orange/Incidencias
                    purple: '#7A5299',   // MiVecino Purple/Comunidad
                    gray: '#E2E8F0',     // Light border/gray
                }
            }
        },
    },

    plugins: [forms],
};
