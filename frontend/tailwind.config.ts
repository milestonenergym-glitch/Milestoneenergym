import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Palette
        brand: {
          blue: {
            DEFAULT: '#0F52BA',
            50: '#EBF2FF',
            100: '#C8DBFF',
            200: '#90B5FF',
            300: '#5C91FF',
            400: '#2D6EFF',
            500: '#0F52BA',
            600: '#0C44A0',
            700: '#093580',
            800: '#062560',
            900: '#031440',
          },
          gold: {
            DEFAULT: '#D4AF37',
            50: '#FDF9EC',
            100: '#F9EFCC',
            200: '#F3DF9A',
            300: '#EDCE68',
            400: '#E7BE3A',
            500: '#D4AF37',
            600: '#B5922A',
            700: '#8F721F',
            800: '#6A5315',
            900: '#45360D',
          },
        },
        // Background System
        background: {
          DEFAULT: '#0A0A0A',
          secondary: '#111111',
          card: '#141414',
          elevated: '#1A1A1A',
          glass: 'rgba(255, 255, 255, 0.04)',
        },
        // Text
        foreground: {
          DEFAULT: '#FFFFFF',
          muted: '#A0A0A0',
          subtle: '#666666',
        },
        // Shadcn compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Status colors
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-bebas)', 'Impact', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
        hero: ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'hero-sm': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #0F52BA 0%, #1a6dff 50%, #D4AF37 100%)',
        'gradient-blue': 'linear-gradient(135deg, #0F52BA 0%, #1e63d4 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #f0c850 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0A0A 0%, #141414 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.7) 60%, rgba(10,10,10,1) 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'gradient-border': 'linear-gradient(135deg, #0F52BA, #D4AF37)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'brand-blue': '0 0 30px rgba(15, 82, 186, 0.4)',
        'brand-gold': '0 0 30px rgba(212, 175, 55, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.6)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(15, 82, 186, 0.2)',
        'glow-blue': '0 0 60px rgba(15, 82, 186, 0.3)',
        'glow-gold': '0 0 60px rgba(212, 175, 55, 0.3)',
        'premium': '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(15, 82, 186, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-down': 'fadeDown 0.6s ease forwards',
        'slide-in-left': 'slideInLeft 0.6s ease forwards',
        'slide-in-right': 'slideInRight 0.6s ease forwards',
        'scale-in': 'scaleIn 0.4s ease forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-blue': 'pulseBlue 2s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 5s ease infinite',
        'count-up': 'countUp 1s ease forwards',
        'typing': 'typing 2s steps(20, end) forwards',
        'border-rotate': 'borderRotate 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        pulseBlue: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(15, 82, 186, 0.3)' },
          '50%': { boxShadow: '0 0 50px rgba(15, 82, 186, 0.7)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 50px rgba(212, 175, 55, 0.7)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        borderRotate: {
          '0%': { '--angle': '0deg' } as any,
          '100%': { '--angle': '360deg' } as any,
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}

export default config
