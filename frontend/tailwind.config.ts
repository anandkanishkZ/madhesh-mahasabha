import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mm: {
          primary: 'var(--mm-primary)',
          accent: 'var(--mm-accent)',
          warm: 'var(--mm-warm)',
          ink: 'var(--mm-ink)',
          bg: 'var(--mm-bg)',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        'nepali-body': ['var(--font-mukta)', 'var(--font-noto-sans-devanagari)', 'system-ui'],
        'nepali-heading': ['var(--font-baloo-bhai-2)', 'var(--font-mukta)', 'var(--font-noto-sans-devanagari)', 'system-ui'],
        'nepali-sidebar': ['var(--font-khand)', 'var(--font-mukta)', 'var(--font-noto-sans-devanagari)', 'system-ui'],
        'sans': ['var(--font-inter)', 'system-ui'],
      },
      lineHeight: {
        'devanagari': '2.0',
        'devanagari-heading': '1.75',
        'devanagari-large': '1.6',
      },
      spacing: {
        'devanagari-top': '0.375rem',
        'devanagari-bottom': '0.25rem',
      },
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: 'var(--font-noto-sans-devanagari), system-ui',
            lineHeight: '1.7',
            h1: {
              fontFamily: 'var(--font-mukta), var(--font-noto-sans-devanagari), system-ui',
              fontWeight: '800',
            },
            h2: {
              fontFamily: 'var(--font-mukta), var(--font-noto-sans-devanagari), system-ui',
              fontWeight: '700',
            },
            h3: {
              fontFamily: 'var(--font-mukta), var(--font-noto-sans-devanagari), system-ui',
              fontWeight: '700',
            },
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;