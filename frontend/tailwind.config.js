/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'neon': '0 0 5px theme(colors.primary.500), 0 0 20px theme(colors.primary.500)',
        'neon-lg': '0 0 10px theme(colors.primary.500), 0 0 30px theme(colors.primary.500)',
        'neon-xl': '0 0 15px theme(colors.primary.500), 0 0 40px theme(colors.primary.500)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require("daisyui")
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#a855f7",
          "secondary": "#3b82f6",
          "accent": "#ec4899",
          "neutral": "#191D24",
          "base-100": "#0A0E17",
          "base-200": "#121A29",
          "base-300": "#1E293B",
          "base-content": "#E2E8F0",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
      },
      "dark",
      "synthwave"
    ],
    darkTheme: "mytheme",
    base: true,
    styled: true,
    utils: true,
  },
}
