// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sendwe-blue': {
          DEFAULT: '#1E3A8A', // Un bleu foncé, similaire au bleu marine
          light: '#2563EB', // Un bleu plus vif
          dark: '#1E3A8A', // Gardons le même que DEFAULT si tu ne veux pas de nuances
        },
        'sendwe-green': {
          DEFAULT: '#10B981', // Un vert d'eau, frais
          light: '#34D399', // Un vert plus clair
          dark: '#059669', // Un vert plus foncé
        },
        'sendwe-gray': {
          DEFAULT: '#F3F4F6', // Un gris très clair pour les arrière-plans
          dark: '#4B5563', // Un gris plus foncé pour le texte
        },
        'sendwe-red': {
          DEFAULT: '#EF4444', // Un rouge standard pour les erreurs/dangers
        },
        'sendwe-orange': {
          DEFAULT: '#F59E0B', // Un orange pour les avertissements ou accents
        },
        'sendwe-yellow': { // <-- NOUVEAU : Ajout de la couleur jaune
          DEFAULT: '#FBBF24', // Un jaune doré, distinctif mais pas trop vif
          light: '#FCD34D',
          dark: '#D97706',
        },
      },
    },
  },
  plugins: [],
}