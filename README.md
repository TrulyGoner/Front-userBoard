#  Task Board Frontend

Modern React + TypeScript + Vite frontend for collaborative task management.
Backend: [https://github.com/koshkinoko-hana/task-board-api/pull/1](https://github.com/koshkinoko-hana/task-board-api)

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
- **User Management** — Admin panel with configurable table components
- **Responsive UI** — Built with SCSS & accessible components
- **Redux State** — Centralized auth & tasks management
- **Type-safe** — Full TypeScript coverage

##  Tech Stack

- **React 19** — UI framework
- **Redux Toolkit** — State management
- **Vite** — Lightning-fast bundler
- **TypeScript** — Type safety
- **SCSS** — Styling
- **React Router** — Client-side routing
- **React Window** — Virtualization for large lists

##  Project Structure

```
src/
├── pages/       # Page components (Auth, Tasks, Admin)
├── features/    # Feature-specific logic
├── shared/      # Reusable UI & utilities
│   ├── ui/
│   │   ├── UserTable/      # Virtualized table component
│   │   ├── usersTable/     # HTML table component
│   │   └── ...other UI
│   └── utils/tableConfigs.ts  # Table configuration factories
├── store/       # Redux slices
└── components/  # Shared components
```



