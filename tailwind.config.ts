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
                    bg: '#191a1f',
                    'bg-secondary': '#1e2028',
                    'bg-tertiary': '#252730',
                    border: '#2d2f3a',
                    text: '#ffffff',
                    'text-secondary': '#a0a0ab',
                },
                primary: {
                    DEFAULT: '#3b82f6',
                    dark: '#2563eb',
                    light: '#60a5fa',
                },
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                pending: '#eab308',
            },
        },
    },
    plugins: [],
}
export default config
