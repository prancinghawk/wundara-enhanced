# Wundara Client

This is the client application for Wundara, built with React, TypeScript, and Tailwind CSS.

## Prerequisites

- Node.js 18+ and npm 9+

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run check-format` - Check code formatting

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── services/      # API services
  ├── theme/         # Theme configuration
  ├── types/         # TypeScript type definitions
  ├── utils/         # Utility functions
  ├── App.tsx        # Main application component
  └── main.tsx       # Application entry point
```

## Code Style

- We use ESLint and Prettier for code quality and formatting
- Pre-commit hooks are set up to enforce code style
- Follow the [React Hooks Rules](https://reactjs.org/docs/hooks-rules.html)
- Use TypeScript for type safety

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=your_api_url
```

## License

MIT
# Cloudflare rebuild Thu Oct  9 19:31:58 AEST 2025
