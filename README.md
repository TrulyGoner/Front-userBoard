#  Task Board Frontend

Modern React + TypeScript + Vite frontend for collaborative task management.

##  Quick Start

```bash
npm install
npm run dev        # Development server
npm run build      # Production build
npm run lint       # Code quality check
```

##  Features

- **Authentication** — Register & login with nickname-based accounts
- **Task Management** — Create, edit, view tasks with status & priority
- **Tagging System** — Organize tasks with custom tags
- **Responsive UI** — Built with SCSS & accessible components
- **Redux State** — Centralized auth & tasks management
- **Type-safe** — Full TypeScript coverage

##  Tech Stack

- **React 18** — UI framework
- **Redux Toolkit** — State management
- **Vite** — Lightning-fast bundler
- **TypeScript** — Type safety
- **SCSS** — Styling
- **React Router** — Client-side routing

##  Project Structure

```
src/
├── pages/       # Page components (Auth, Tasks)
├── features/    # Feature-specific logic
├── shared/      # Reusable UI & utilities
├── store/       # Redux slices
└── components/  # Shared components
```

##  API Integration

Connects to Task Board API (`http://localhost:3000`)

Default endpoints configured in `src/shared/config/api.ts`
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
