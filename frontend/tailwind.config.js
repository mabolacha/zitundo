/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A3A5C',
          dark: '#0D2238',
          light: '#F0F5FA',
        },
        accent: {
          DEFAULT: '#E8714A',
          hover: '#D9622B',
        },
        cream: '#F7F1E3',
        success: 'hsl(160, 84%, 39%)',
        warning: 'hsl(43, 96%, 56%)',
        error: 'hsl(0, 84%, 60%)',
        background: '#F0F5FA',
        card: '#FFFFFF',
        'card-hover': '#EAF0F7',
        border: '#D0DCE8',
        foreground: 'hsl(222, 47%, 11%)',
        muted: {
          DEFAULT: 'hsl(215, 16%, 47%)',
          foreground: 'hsl(215, 16%, 65%)',
        },
      },
      fontFamily: {
        'display': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'sans': ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1A3A5C, #0D2238)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
