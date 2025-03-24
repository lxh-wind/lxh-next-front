/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
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
  		colors: {
  			// Simple color palette that works with Ant Design
  			primary: '#1677ff',
  			success: '#52c41a',
  			warning: '#faad14',
  			error: '#ff4d4f',
  			info: '#1677ff',
  		},
  		borderRadius: {
  			lg: '0.5rem',
  			md: '0.375rem',
  			sm: '0.25rem'
  		},
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-10px) translateX(10px)' },
          '50%': { transform: 'translateY(0px) translateX(20px)' },
          '75%': { transform: 'translateY(10px) translateX(10px)' },
          '100%': { transform: 'translateY(0px) translateX(0px)' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
      },
  	}
  },
  corePlugins: {
  	preflight: true,
  },
  plugins: [],
}
