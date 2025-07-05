// tailwind.config.js
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                neutral: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                },
            },
        },
    },
    plugins: [require('@tailwindcss/line-clamp')],
};
