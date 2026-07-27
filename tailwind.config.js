/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "bg-base": "var(--color-bg-base)",
        "bg-weak": "var(--color-bg-weak)",
        "surface-base": "var(--color-surface-base)",
        "surface-hover": "var(--color-surface-hover)",
        "surface-active": "var(--color-surface-active)",
        "surface-raised": "var(--color-surface-raised)",
        "text-strong": "var(--color-text-strong)",
        "text-base": "var(--color-text-base)",
        "text-weak": "var(--color-text-weak)",
        "border-base": "var(--color-border-base)",
        "border-weak": "var(--color-border-weak)",
        "border-focus": "var(--color-border-focus)",
        "interactive-primary": "var(--color-interactive-primary)",
        "interactive-hover": "var(--color-interactive-hover)",
        "success": "var(--color-success)",
        "warning": "var(--color-warning)",
        "error": "var(--color-error)",
        "info": "var(--color-info)",
      },
    },
  },
  plugins: [],
}
