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
          DEFAULT: 'hsl(199, 89%, 48%)',
          dark: 'hsl(199, 89%, 40%)',
          light: 'hsl(199, 89%, 60%)',
        },
        success: 'hsl(160, 84%, 39%)',
        warning: 'hsl(43, 96%, 56%)',
        error: 'hsl(0, 84%, 60%)',
        background: 'hsl(210, 20%, 98%)',
        card: 'hsl(0, 0%, 100%)',
        'card-hover': 'hsl(210, 20%, 96%)',
        border: 'hsl(214, 32%, 91%)',
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
        'gradient-primary': 'linear-gradient(135deg, hsl(199, 89%, 48%), hsl(199, 89%, 60%))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
