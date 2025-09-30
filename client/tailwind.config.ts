import type { Config } from 'tailwindcss';
import { createThemes } from 'tw-colors';
import forms from '@tailwindcss/forms';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/ui/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        display: ['Roboto Flex', 'sans-serif'],
      },
      colors: {
        brand: {
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Material-like tokens used by the UI kit
        'on-surface': '#1C1B1F',
        'on-surface-variant': '#49454F',
        surface: '#FFFBFE',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F7F2FA',
        'surface-container': '#F3EDF7',
        'surface-container-high': '#ECE6F0',
        'surface-container-highest': '#E6E0E9',
        scrim: 'rgba(0,0,0,0.32)',
        'on-primary': '#FFFFFF',
        'secondary-container': '#E8DEF8',
        'on-secondary-container': '#1D192B',
        secondary: '#625B71',
        tertiary: '#7D5260',
        outline: '#79747E',
      },
    },
  },
  plugins: [
    forms,
    createThemes({
      light: {
        primary: {
          DEFAULT: '#6750A4',
          container: '#EADDFF',
          on: '#FFFFFF',
          onContainer: '#21005D',
        },
        secondary: {
          DEFAULT: '#625B71',
          container: '#E8DEF8',
          on: '#FFFFFF',
          onContainer: '#1D192B',
        },
        error: {
          DEFAULT: '#B3261E',
          container: '#F9DEDC',
          on: '#FFFFFF',
          onContainer: '#410E0B',
        },
        background: {
          DEFAULT: '#FFFBFE',
          on: '#1C1B1F',
        },
        surface: {
          DEFAULT: '#FFFBFE',
          on: '#1C1B1F',
          variant: '#E7E0EC',
          onVariant: '#49454F',
        },
        outline: '#79747E',
      },
      dark: {
        primary: {
          DEFAULT: '#D0BCFF',
          container: '#4F378B',
          on: '#371E73',
          onContainer: '#EADDFF',
        },
        secondary: {
          DEFAULT: '#CCC2DC',
          container: '#4A4458',
          on: '#332D41',
          onContainer: '#E8DEF8',
        },
        error: {
          DEFAULT: '#F2B8B5',
          container: '#8C1D18',
          on: '#601410',
          onContainer: '#F9DEDC',
        },
        background: {
          DEFAULT: '#1C1B1F',
          on: '#E6E1E5',
        },
        surface: {
          DEFAULT: '#1C1B1F',
          on: '#E6E1E5',
          variant: '#49454F',
          onVariant: '#CAC4D0',
        },
        outline: '#938F99',
      },
    }),
  ],
};

export default config;
