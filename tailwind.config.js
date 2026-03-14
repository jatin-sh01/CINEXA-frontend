export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "app-bg": "var(--bg, #ffffff)",
        "card-bg": "var(--card-bg, #f9fafb)",
        "app-border": "var(--border, #e5e7eb)",
        "app-primary": "var(--primary, #0f172a)",
        "app-secondary": "var(--secondary, #64748b)",
        "app-muted": "var(--muted, #94a3b8)",
        "app-success": "var(--success, #16a34a)",
        "app-warning": "var(--warning, #ea580c)",
        "app-error": "var(--error, #dc2626)",
        "app-info": "var(--info, #0284c7)",
      },
      backgroundColor: {
        "app-bg": "var(--bg, #ffffff)",
        "card-bg": "var(--card-bg, #f9fafb)",
      },
      textColor: {
        "app-primary": "var(--primary, #0f172a)",
        "app-secondary": "var(--secondary, #64748b)",
        "app-muted": "var(--muted, #94a3b8)",
      },
      borderColor: {
        "app-border": "var(--border, #e5e7eb)",
      },
    },
  },
  plugins: [
    function ({ addBase, addUtilities }) {
      addBase({
        "input, button, select, textarea": {
          fontSize: "16px",
        },

        html: {
          "touch-action": "manipulation",
        },
      });

      addUtilities({
        "@variants dark": {
          ".focus-visible": {
            "@apply outline-2 outline-offset-2 outline-app-primary": {},
          },
        },
      });
    },
  ],
};
