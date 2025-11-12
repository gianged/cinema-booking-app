# 💻 Development Guide

Best practices and guidelines for developing the Cinema Booking App.

---

## 🔄 Development Workflow

### 1. Before You Start

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Run validation
npm run validate
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

### 3. Development Cycle

```bash
# Start development server
npm run dev

# In another terminal, run type checking
npm run type-check --watch

# Run linter
npm run lint

# Format code
npm run format
```

### 4. Before Committing

```bash
# Run all checks
npm run validate

# Fix any auto-fixable issues
npm run lint:fix
npm run format
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation
- `style:` - Formatting
- `test:` - Adding tests
- `chore:` - Maintenance

---

## 📂 Project Structure

```
src/
├── components/       # Reusable React components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── contexts/        # React contexts
├── services/        # API client
├── types/           # TypeScript types
├── utils/           # Utility functions
├── styles/          # 7-1 SCSS architecture
├── config/          # Configuration
└── server/          # Backend (Fastify)
    ├── routes/      # API routes
    ├── models/      # Database models
    ├── middleware/  # Middleware
    └── utils/       # Server utilities
```

---

## 🎨 Code Style Guide

### TypeScript

**DO:**
```typescript
// Use explicit types
interface User {
  id: number;
  username: string;
  role: 'a' | 'u';
}

// Use type imports
import type { Film } from '@types';

// Use const for immutable values
const API_URL = 'http://localhost:4000';
```

**DON'T:**
```typescript
// Don't use 'any'
function getData(): any { } // ❌

// Don't use 'var'
var count = 0; // ❌

// Don't ignore types
const user = data as any; // ❌
```

### React Components

**DO:**
```typescript
import type { FC } from 'react';
import type { MovieCardProps } from '@types';

export const MovieCard: FC<MovieCardProps> = ({
  filmName,
  filmDescription
}) => {
  return (
    <div className="movie-card">
      <h3>{filmName}</h3>
      <p>{filmDescription}</p>
    </div>
  );
};
```

**DON'T:**
```typescript
// Don't use default exports for components
export default function MovieCard(props: any) { } // ❌

// Don't inline styles
<div style={{ color: 'red' }}></div> // ❌

// Don't use index as key
{items.map((item, index) => <div key={index} />)} // ❌
```

### SCSS

**DO:**
```scss
@use '@styles/abstracts' as *;

.movie-card {
  @include flex-center;
  padding: $spacing-md;

  @include respond-to('md') {
    padding: $spacing-sm;
  }
}
```

**DON'T:**
```scss
// Don't use magic numbers
.movie-card {
  padding: 16px; // ❌ Use $spacing-md
}

// Don't nest too deeply
.a .b .c .d .e { } // ❌ Max 3 levels
```

---

## 🪝 Using Custom Hooks

### useApi Hook

```typescript
import { useApi } from '@hooks';
import { api } from '@services/api';

const MyComponent = () => {
  const { data, loading, error, execute } = useApi(
    api.getFilms,
    {
      showSuccessMessage: true,
      showErrorMessage: true,
    }
  );

  useEffect(() => {
    execute();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <Error message={error.message} />;

  return <FilmList films={data} />;
};
```

### usePagination Hook

```typescript
import { usePagination } from '@hooks';

const MyComponent = () => {
  const {
    paginatedData,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
  } = usePagination(allFilms, 10);

  return (
    <>
      <FilmGrid films={paginatedData} />
      <Pagination
        current={currentPage}
        total={totalPages}
        onNext={nextPage}
        onPrevious={previousPage}
      />
    </>
  );
};
```

---

## 🎯 Best Practices

### 1. Component Organization

```typescript
// 1. Imports
import { useState, useEffect } from 'react';
import type { FC } from 'react';

// 2. Types
interface Props {
  title: string;
}

// 3. Component
export const MyComponent: FC<Props> = ({ title }) => {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Effects
  useEffect(() => {}, []);

  // 6. Handlers
  const handleClick = () => {};

  // 7. Render
  return <div>{title}</div>;
};
```

### 2. Error Handling

```typescript
// Always handle errors
try {
  const data = await api.getFilms();
  setFilms(data);
} catch (error) {
  logger.error('Failed to fetch films:', error);
  message.error('Failed to load films');
}
```

### 3. Loading States

```typescript
// Always show loading states
if (loading) return <LoadingSkeleton type="card" count={6} />;
if (error) return <ErrorMessage error={error} />;
if (!data) return null;

return <DataDisplay data={data} />;
```

### 4. Type Safety

```typescript
// Use type imports
import type { Film } from '@types';

// Define return types
async function getFilm(id: number): Promise<Film> {
  return api.getFilmById(id);
}

// Use proper typing for events
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test --watch

# Run tests with coverage
npm test --coverage
```

### Writing Tests

```typescript
import { render, screen } from '@testing-library/react';
import { MovieCard } from './MovieCard';

describe('MovieCard', () => {
  it('renders film name', () => {
    render(<MovieCard filmName="Test Film" />);
    expect(screen.getByText('Test Film')).toBeInTheDocument();
  });
});
```

---

## 🐛 Debugging

### Backend Debugging

```typescript
// Use logger instead of console.log
import logger from './utils/logger';

logger.debug('Debug info');
logger.info('Info message');
logger.warn('Warning');
logger.error('Error', error);
```

### Frontend Debugging

```typescript
// React DevTools
// Install: https://react.dev/learn/react-developer-tools

// Check component props and state
// Use the Components tab in browser DevTools
```

### Database Debugging

```typescript
// Enable SQL logging in development
// Set in .env:
LOG_LEVEL=debug

// Check logs/combined.log for SQL queries
```

---

## 📦 Adding New Features

### 1. Create Types

```typescript
// src/types/models.ts
export interface NewFeature {
  id: number;
  name: string;
}
```

### 2. Create API Endpoint

```typescript
// src/server/routes/featureRoutes.ts
export default async function featureRoutes(fastify: FastifyInstance) {
  fastify.get('/feature', async (request, reply) => {
    // Implementation
  });
}
```

### 3. Add to API Service

```typescript
// src/services/api.ts
async getFeatures(): Promise<Feature[]> {
  return this.request<Feature[]>('/feature');
}
```

### 4. Create Component

```typescript
// src/components/FeatureCard.tsx
import type { FC } from 'react';
import type { Feature } from '@types';

export const FeatureCard: FC<{ feature: Feature }> = ({ feature }) => {
  return <div>{feature.name}</div>;
};
```

### 5. Add Styles

```scss
// src/styles/components/_feature-card.scss
@use '../abstracts' as *;

.feature-card {
  @include card-base;
  padding: $spacing-md;
}
```

---

## 🔍 Code Review Checklist

Before submitting a PR:

- [ ] Code follows style guide
- [ ] All types are defined (no `any`)
- [ ] Tests are written and passing
- [ ] `npm run validate` passes
- [ ] No console.log statements
- [ ] Error handling is implemented
- [ ] Loading states are shown
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No sensitive data in code

---

## 📚 Resources

### Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Fastify Documentation](https://fastify.dev/)
- [Ant Design Components](https://ant.design/components/overview)

### Tools
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [RegEx Tester](https://regex101.com/)
- [JWT Debugger](https://jwt.io/)

---

**Happy coding! 🚀**
