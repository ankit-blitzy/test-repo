import type { Config } from 'tailwindcss'

/**
 * TailwindCSS Configuration for CALC Scientific Calculator
 *
 * Defines calculator-specific design tokens for the dark-themed scientific
 * calculator UI including custom colors, spacing, typography, grid layouts,
 * and border radius values. All visual styling in the application uses
 * TailwindCSS utility classes referencing these custom tokens.
 *
 * @see AAP Section 0.5.1 Group 4 — Content paths and custom theme tokens
 * @see AAP Section 0.5.3 — Dark-themed calculator layout specifications
 * @see AAP Section 0.7.4 — TailwindCSS-only styling requirement
 */
const config: Config = {
  /**
   * Content paths for TailwindCSS class scanning.
   * Includes the HTML entry point and all TypeScript/TSX source files
   * to ensure all utility classes used in components are detected.
   */
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],

  /**
   * Theme configuration extending the default TailwindCSS theme
   * with calculator-specific design tokens. Uses `extend` to preserve
   * all default utility classes while adding custom values.
   */
  theme: {
    extend: {
      /**
       * Calculator-specific color palette for the dark-themed UI.
       * Colors are organized under the `calculator` namespace to avoid
       * conflicts with default TailwindCSS colors.
       *
       * Usage examples:
       * - `bg-calculator-bg` — Main calculator background
       * - `bg-calculator-key-operator` — Operator button background
       * - `text-calculator-text` — Primary text color
       */
      colors: {
        calculator: {
          /** Dark calculator background (#1a1a2e) */
          bg: '#1a1a2e',
          /** Display area background (#16213e) */
          display: '#16213e',
          /** Default key background (#0f3460) */
          'key-default': '#0f3460',
          /** Operator key red accent (#e94560) */
          'key-operator': '#e94560',
          /** Scientific function key purple (#533483) */
          'key-scientific': '#533483',
          /** Equals key matching operator color (#e94560) */
          'key-equal': '#e94560',
          /** Number key background (#1a1a2e) */
          'key-number': '#1a1a2e',
          /** Primary text color (#eee) */
          text: '#eee',
          /** Secondary/dimmed text color (#999) */
          'text-dim': '#999',
          /** Accent color for highlights and active states (#e94560) */
          accent: '#e94560',
          /** History panel background (#0f3460) */
          history: '#0f3460',
        },
      },

      /**
       * Calculator-specific spacing tokens for keypad grid layout.
       * Provides consistent sizing for calculator keys and display area.
       *
       * Usage examples:
       * - `h-key` — Standard key height (3.5rem / 56px)
       * - `h-key-lg` — Large key height (4rem / 64px)
       * - `h-display` — Display area height (6rem / 96px)
       */
      spacing: {
        /** Standard calculator key size (3.5rem / 56px) */
        'key': '3.5rem',
        /** Large calculator key height (4rem / 64px) */
        'key-lg': '4rem',
        /** Calculator display height (6rem / 96px) */
        'display': '6rem',
      },

      /**
       * Calculator-specific font family stacks.
       * Monospace fonts for the calculator display ensure uniform character
       * width for mathematical expressions. Sans-serif for UI elements.
       *
       * Usage examples:
       * - `font-calculator` — Monospace font for expression display
       * - `font-display` — Sans-serif font for UI text and labels
       */
      fontFamily: {
        /** Monospace font stack for calculator expression display */
        calculator: ['SF Mono', 'Fira Code', 'monospace'],
        /** Sans-serif font stack for UI labels and headers */
        display: ['Inter', 'system-ui', 'sans-serif'],
      },

      /**
       * Grid template column definitions for calculator keypad layouts.
       * Supports both standard 4-column and extended 5-column scientific layouts.
       *
       * Usage examples:
       * - `grid-cols-keypad-4` — Standard 4-column keypad (digits + operators)
       * - `grid-cols-keypad-5` — Extended 5-column scientific keypad
       */
      gridTemplateColumns: {
        /** Standard 4-column keypad layout (digits 0-9, operators) */
        'keypad-4': 'repeat(4, 1fr)',
        /** Extended 5-column scientific keypad layout */
        'keypad-5': 'repeat(5, 1fr)',
      },

      /**
       * Calculator-specific border radius for key buttons.
       * Provides a consistent rounded appearance for all calculator keys.
       *
       * Usage example:
       * - `rounded-key` — Rounded calculator key corners (0.75rem / 12px)
       */
      borderRadius: {
        /** Rounded calculator key corners (0.75rem / 12px) */
        'key': '0.75rem',
      },
    },
  },

  /**
   * TailwindCSS plugins array.
   * No additional plugins are required for the calculator application.
   * All styling needs are met by default TailwindCSS utilities combined
   * with the custom theme extensions defined above.
   */
  plugins: [],
}

export default config
