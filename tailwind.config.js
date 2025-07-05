// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
    // NOTE: In v4 with the Vite plugin, the `content` key is no longer needed here!
    // The Vite plugin handles scanning your files automatically.

    darkMode: 'selector', // This remains the same and is correct.

    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/aspect-ratio'),
    ],
}