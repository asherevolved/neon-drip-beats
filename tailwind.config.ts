import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'bebas': ['Bebas Neue', 'Arial Black', 'sans-serif'],
				'inter': ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				'neon-lime': 'hsl(var(--neon-lime))',
				'neon-lime-glow': 'hsl(var(--neon-lime-glow))',
				'neon-lime-dark': 'hsl(var(--neon-lime-dark))',
				'blood-red': 'hsl(var(--blood-red))',
				'blood-red-glow': 'hsl(var(--blood-red-glow))',
				'jet-black': 'hsl(var(--jet-black))',
				'charcoal': 'hsl(var(--charcoal))',
				'graphite': 'hsl(var(--graphite))',
				'text-white': 'hsl(var(--text-white))',
				'muted-gray': 'hsl(var(--muted-gray))',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'liquid-flow': {
					'0%': {
						'background-position': '0% 50%'
					},
					'50%': {
						'background-position': '100% 50%'
					},
					'100%': {
						'background-position': '0% 50%'
					}
				},
				'neon-pulse': {
					'0%, 100%': {
						'text-shadow': '0 0 5px hsl(var(--neon-lime)), 0 0 10px hsl(var(--neon-lime)), 0 0 15px hsl(var(--neon-lime))'
					},
					'50%': {
						'text-shadow': '0 0 2px hsl(var(--neon-lime)), 0 0 5px hsl(var(--neon-lime)), 0 0 8px hsl(var(--neon-lime))'
					}
				},
				'shimmer': {
					'0%': {
						'background-position': '-200% 0'
					},
					'100%': {
						'background-position': '200% 0'
					}
				},
				'flicker': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' },
					'75%': { opacity: '0.9' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'liquid-flow': 'liquid-flow 20s ease-in-out infinite',
				'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'flicker': 'flicker 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
