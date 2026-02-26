/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.html", "./*.js"],
    theme: {
        extend: {
            colors: {
                nude: {
                    100: '#Fdfbf7',
                    200: '#FBF5F7',
                    300: '#F4E8EA',
                    400: '#E6D3D8',
                },
                blush: {
                    100: '#F9EAEF',
                    200: '#F0D1DC',
                    300: '#E0AEBE',
                    400: '#C7889D',
                    500: '#A9637B',
                },
                sand: {
                    100: '#FDFCFB',
                    200: '#F5EFEF',
                    300: '#E8DFDF',
                    400: '#D5CACA',
                },
                charcoal: '#4A3B40',
            },
            fontFamily: {
                sans: ['Lato', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
