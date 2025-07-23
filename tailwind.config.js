/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      colors: {
        apt: {
          900: '#0B090A',  // darkest
          800: '#161A1D',
          700: '#660708',
          600: '#A4161A',
          500: '#BA181B',  
          400: '#E5383B',
          300: '#B1A7A6',
          200: '#D3D3D3',
          100: '#F5F3F4',  // lightest
        }
      },
      keyframes: {
        'bounce-in': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        'bounce-in': 'bounce-in 0.3s ease-out'
      }
    },
  },
  plugins: [],
}
