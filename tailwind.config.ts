import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    bg: '#0F172A',
                    'bg-secondary': '#1E293B',
                    'bg-tertiary': '#334155',
                    border: '#475569',
                    text: '#ffffff',
                    'text-secondary': '#94A3B8',
                },
                primary: {
                    DEFAULT: '#8B5CF6',
                    dark: '#7C3AED',
                    light: '#A78BFA',
                },
                secondary: {
                    DEFAULT: '#3B82F6',
                    dark: '#2563EB',
                    light: '#60A5FA',
                },
                accent: {
                    cyan: '#06B6D4',
                    pink: '#EC4899',
                    orange: '#F97316',
                },
                success: '#10B981',
                warning: '#F59E0B',
                error: '#EF4444',
                pending: '#FCD34D',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                'gradient-secondary': 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                'gradient-accent': 'linear-gradient(135deg, #EC4899 0%, #F97316 100%)',
                'gradient-success': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
                'mesh-gradient': `
                    radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
                    radial-gradient(at 50% 0%, rgba(59, 130, 246, 0.15) 0px, transparent 50%),
                    radial-gradient(at 100% 0%, rgba(6, 182, 212, 0.15) 0px, transparent 50%)
                `,
            },
            animation: {
                'fadeIn': 'fadeIn 0.5s ease-in-out',
                'slideUp': 'slideUp 0.5s ease-out',
                'slideIn': 'slideIn 0.5s ease-out',
                'float': 'float 3s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
                    '50%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
            boxShadow: {
                'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
                'glow-lg': '0 0 40px rgba(139, 92, 246, 0.5)',
                'purple': '0 4px 20px rgba(139, 92, 246, 0.4)',
                'blue': '0 4px 20px rgba(59, 130, 246, 0.4)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.2)',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
export default config
