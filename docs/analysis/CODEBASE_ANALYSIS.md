# Cinema Booking App - Comprehensive Codebase Analysis

## EXECUTIVE SUMMARY

This is a full-stack **React + Node.js/Express + MySQL** cinema booking application built as a learning project. The application has a functional architecture supporting user authentication, film browsing, seat booking, and admin management features. However, it suffers from several critical security issues, architectural anti-patterns, and code organization problems that should be addressed before production use.

---

## 1. PROJECT STRUCTURE & TECHNOLOGY STACK

### Overall Architecture
```
cinema-booking-app/
├── src/
│   ├── server/                 # Backend API (Express)
│   │   ├── api/               # Route handlers
│   │   │   ├── userRoute.ts
│   │   │   ├── filmRoute.ts
│   │   │   ├── showRoute.ts
│   │   │   ├── categoryRoute.ts
│   │   │   └── ticketRoute.ts
│   │   ├── models/            # Sequelize ORM models
│   │   │   ├── user.ts
│   │   │   ├── film.ts
│   │   │   ├── show_schedule.ts
│   │   │   ├── ticket.ts
│   │   │   ├── category.ts
│   │   │   ├── film_category.ts
│   │   │   └── review.ts
│   │   └── server.ts          # Main Express server
│   ├── pages/                 # React page components (11 files)
│   ├── components/            # React reusable components
│   ├── contexts/              # React Context API
│   │   ├── AuthenticateContext.tsx
│   │   └── BookingContext.tsx
│   └── ...
├── package.json
└── tsconfig.json
```

### Technology Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 18.3.1 |
| **Styling** | Ant Design (antd) | 5.17.4 |
| **Icons** | FontAwesome | 6.5.2 |
| **Routing** | React Router DOM | 6.23.1 |
| **State** | React Context API | 18.3.1 |
| **Storage** | React Cookies | 7.1.4 |
| **Backend** | Express.js | 4.19.2 |
| **ORM** | Sequelize | 6.37.3 |
| **Database** | MySQL | 3.10.0 |
| **Language** | TypeScript | 4.9.5 |
| **Code Size** | ~3,200 lines | - |

---

## 2. MAIN COMPONENTS & RESPONSIBILITIES

### Frontend Architecture

#### **Context Providers (State Management)**
1. **AuthenticateContext** (`src/contexts/AuthenticateContext.tsx`)
   - Manages user authentication state
   - Stores user ID, display name, and role
   - Handles login/logout via cookies
   - Issues: Asynchronous login doesn't return properly; no token management

2. **BookingContext** (`src/contexts/BookingContext.tsx`)
   - Manages cinema booking data (film ID, show ID, price, seat amount)
   - Persists data using cookies
   - Issues: No validation; mixing concerns (UI state + persistence)

#### **Route Guards**
- **UserChecking** (`src/components/UserChecking.tsx`): Redirects non-logged-in users
- **AdminChecking** (`src/components/AdminChecking.tsx`): Restricts admin routes

#### **Key Pages** (11 total, ~2,216 lines)
| Page | Lines | Purpose |
|------|-------|---------|
| ManageShow | 470 | Admin: Create/update/delete shows |
| ManageFilm | 469 | Admin: Create/update/delete films |
| ManageUser | 305 | Admin: Manage users |
| ManageCategory | 269 | Admin: Manage film categories |
| Payment | 138 | Process ticket payments with QR code |
| RegisterPage | 114 | User registration form |
| FilmDetail | 76 | Show film details and reviews |
| Home | 66 | Main layout with navigation |
| ManageTicket | 62 | Admin: View all tickets |

#### **Key Components**
- **Authenticate**: Login/logout dropdown menu
- **FilmCard**: Displays film with current shows
- **FilmSchedule**: Shows film schedules
- **SlideShow**: Image carousel
- **Booking**: Seat selection interface (50 seats hardcoded)

### Backend Architecture

#### **API Routes** (Endpoints)
```
/security/login              POST    Login user
/security/register           POST    Register new user
/security/user               GET/POST   List/Create users
/security/user/:id           GET/PUT/DELETE   User CRUD
/security/user/cleanup       DELETE   Delete inactive users

/film/currentshow            GET     Active films (premiered 14+ days ago)
/film/active                 GET     All active films
/film                        GET/POST   Film CRUD (with categories)
/film/:id                    GET/PUT/DELETE

/show/active/:id             GET     Active shows for a film
/show                        GET/POST   Show schedules
/show/:id                    GET/PUT/DELETE

/category/active             GET     Active categories
/category                    GET/POST   Category CRUD
/category/:id                GET/PUT/DELETE

/ticket/userview/:id         GET     User's tickets
/ticket                      GET/POST   Ticket CRUD
/ticket/:id                  GET/PUT/DELETE
```

#### **Database Models**
- **User**: id, username, password, role, isActive
- **Film**: id, filmName, filmDescription, poster (BLOB), backdrop (BLOB), premiere, trailer, isActive
- **ShowSchedule**: id, film (FK), showPrice, showDay, beginTime, endTime, room, isActive
- **Ticket**: idTicket, idUser (FK), idShow (FK), ticketAmount, totalPrice
- **Category**: id, categoryName, isActive
- **FilmCategory**: filmId (FK), categoryId (FK) - Junction table
- **Review**: id, filmId, userId, rate, content (defined but not used in API)

#### **Database Configuration**
- Host: localhost
- Port: 8000
- Database: cinema-booking-app-db
- User: admin
- **PASSWORD HARDCODED**: Giang@123 ⚠️

---

## 3. ARCHITECTURAL PATTERNS BEING USED

### Positive Patterns

1. **Context API for State Management**
   - Using React Context to avoid prop drilling
   - Clean separation of authentication and booking concerns
   - Good use of custom providers

2. **Model-View-Controller (MVC) on Backend**
   - Routes handle requests
   - Models define schema and relationships
   - Clean separation between API and data layer

3. **ORM Pattern (Sequelize)**
   - Database abstraction through ORM
   - Relationship definitions (belongsTo, hasMany)
   - Reduces raw SQL queries

4. **Component Composition**
   - Reusable UI components with Ant Design
   - Route guards as wrapper components

### Anti-Patterns & Issues

1. **Multiple Database Instances** ⚠️ CRITICAL
   - Each model file creates its own Sequelize instance
   - This causes duplicate connections and memory leaks
   - Should be a singleton exported from server.ts

   Example (appears in ALL model files):
   ```typescript
   // WRONG - Creating new instance in every model!
   const sequelize = new Sequelize("cinema-booking-app-db", "admin", "Giang@123", {...})
   ```

2. **Hardcoded API Endpoints** ⚠️ HIGH
   - `http://localhost:4000` is hardcoded in 20+ locations across components/pages
   - Makes switching environments impossible
   - No environment variables or constants
   - Found in: ManageFilm, ManageShow, ManageUser, ManageCategory, ManageTicket, Payment, TicketView, LoginPage, FilmCard, FilmSchedule

3. **API Calls in Components** ⚠️ MEDIUM
   - Direct fetch() calls scattered throughout components
   - No centralized API client/service layer
   - No request/response interceptors
   - Duplicate code for similar operations

4. **Asynchronous Login Bug** ⚠️ MEDIUM
   - Login function doesn't properly await async operation
   - Returns false immediately while async getUser() is still pending
   - Creates race conditions in LoginPage

   ```typescript
   // WRONG - Async operation returns false before completion
   const login = (username: string, password: string): boolean => {
       getUser(username, password).then((data) => { ... })
       return false;  // Returns before promise resolves!
   };
   ```

5. **God Components** ⚠️ MEDIUM
   - ManageShow (470 lines) and ManageFilm (469 lines) do too much
   - Mixing data fetching, form handling, table rendering, modals
   - Should be broken into smaller, reusable components

6. **Missing Error Boundaries** ⚠️ MEDIUM
   - No React Error Boundary components
   - Single error can crash entire app
   - No fallback UI for errors

---

## 4. IDENTIFIED CODE SMELLS & ANTI-PATTERNS

### CRITICAL SECURITY ISSUES

1. **Hardcoded Database Credentials**
   ```typescript
   // Found in 6 files:
   // - src/server/server.ts
   // - src/server/models/user.ts
   // - src/server/models/film.ts
   // - src/server/models/show_schedule.ts
   // - src/server/models/ticket.ts
   // - src/server/models/category.ts
   // - src/server/models/film_category.ts
   // - src/server/models/review.ts
   
   new Sequelize("cinema-booking-app-db", "admin", "Giang@123", {
       host: "localhost",
       port: 8000,
       ...
   })
   ```
   **Risk**: Credentials exposed in source code, attackers can directly access database

2. **No Password Salt/Hashing Best Practices**
   - Using simple sha512 without salt
   - README admits this: "js-sha512: to encrypt passwords"
   - Vulnerable to rainbow table attacks
   - Should use bcrypt with salt

3. **No Authentication Middleware**
   - Admin routes have no server-side authorization checks
   - Client-side only checks (easily bypassed)
   - Any user can craft requests to admin endpoints
   - No JWT tokens or session management

4. **No Input Validation on Backend**
   - API routes accept any data without validation
   - No type checking for request bodies
   - Vulnerable to injection attacks
   - No sanitization of user inputs

5. **CORS Not Properly Configured**
   ```typescript
   app.use(cors());  // Allows ANY origin
   ```
   Should specify allowed origins explicitly

### CODE ORGANIZATION ISSUES

6. **No Constants Configuration File**
   - API URLs scattered as magic strings
   - Database config repeated in every file
   - Port hardcoded in multiple places

7. **Duplicate Database Connection Initialization**
   - Each model creates its own Sequelize connection
   - Should be single shared instance
   - Causes: Memory leaks, connection pool exhaustion, sync issues

8. **Missing TypeScript Type Definitions**
   - Props not properly typed
   - Generic `any` types used frequently
   - No Request/Response types for API
   - Example in ManageFilm: `categories.forEach((category: any) => {...})`

9. **Async/Await Inconsistency**
   - Promises created but not awaited properly
   - Race conditions in LoginPage
   - useEffect dependencies incomplete

10. **No Request/Response Validation**
    - Routes assume all fields present
    - No try-catch in some routes
    - Generic 500 errors for all failures

### CODE DUPLICATION

11. **Repeated Fetch Pattern**
    - 20+ identical fetch calls with similar patterns
    - Different hardcoded URLs
    - Should have API service abstraction

12. **Duplicate Model Definitions**
    - Sequelize connection code repeated in 8 files
    - Should be imported from shared module
    - Models don't export shared sequelize instance

13. **Repeated CRUD Routes**
    - Each route file has identical GET/POST/PUT/DELETE patterns
    - No middleware for common operations
    - No request validation middleware

### PERFORMANCE ISSUES

14. **No Pagination**
    - `FilmCard` has TODO: "//TODO: Paging"
    - `findAll()` queries return ALL records
    - Could load thousands of records into memory
    - Table pagination is UI-only, not backend

15. **No Query Optimization**
    - Film routes include associations without selectivity
    - No field limiting (SELECT *)
    - No database indexes specified

16. **Missing Loading States**
    - Many components don't show loading indicators
    - User doesn't know if request succeeded/failed
    - No timeouts or cancellation

17. **Hardcoded Business Logic**
    - Seat count hardcoded to 50
    - Show duration hardcoded to 2 hours
    - Today calculation: `setHours(7, 0, 0, 0)`
    - Should be configurable

### STATE MANAGEMENT ISSUES

18. **Cookie-Based State Persistence**
    - Booking data stored in cookies
    - Could be manipulated by user
    - No server-side validation
    - No encryption

19. **useEffect Dependency Issues**
    - LoginPage: `useEffect(..., [authetication.isLogin, navigate])` runs repeatedly
    - Infinite loops possible
    - Missing dependencies in some effects

20. **Weak Role-Based Authorization**
    - Roles stored as single character ("a" for admin, "u" for user)
    - Role checks using numeric comparison (role?.current === 2)
    - Hard to add new roles
    - Not scalable

### UI/UX ISSUES

21. **Alert Instead of Modal**
    - Using browser `alert()` for user feedback
    - Bad UX, unprofessional
    - Found in Booking.tsx: `alert("Please select at least one seat")`

22. **TODO Comments Indicating Incomplete Features**
    - `//TODO: File upload to server is not working` (ManageFilm.tsx)
    - `//TODO: Fix this insert` (filmRoute.ts)
    - `//TODO: Fix this update as well` (filmRoute.ts)
    - `//TODO: Paging` (FilmCard.tsx)
    - `//TODO: add button` (FilmDetail.tsx)
    - `//TODO: Fix Link` (SlideShow.tsx)
    - `//TODO: array might need fixing` (Dashboard.tsx)

### LOGGING & DEBUGGING

23. **Excessive console.log Usage** (44 occurrences)
    - All errors logged to console
    - `logging: console.log` in Sequelize config logs all queries
    - Should use proper logging library
    - No log levels (debug, info, warn, error)

### MISSING FEATURES

24. **No Error Boundaries**
    - Unhandled errors crash entire app
    - No fallback UI

25. **No Unit Tests**
    - 0 test files
    - No test coverage
    - Testing setup exists but unused

26. **No Integration Tests**
    - No API endpoint testing
    - Manual testing required

27. **No API Documentation**
    - No Swagger/OpenAPI specs
    - No comments on endpoints
    - Endpoint parameters undocumented

---

## 5. AREAS FOR IMPROVEMENT (PRIORITY ORDER)

### TIER 1: CRITICAL (Security & Stability)

#### 1. Remove Hardcoded Credentials ⚠️
**Impact**: CRITICAL
**Effort**: Easy
- Move database config to `.env` file
- Use `dotenv` package
- Never commit credentials to git
- Current files: 8 model files + server.ts

#### 2. Consolidate Database Connection ⚠️
**Impact**: HIGH
**Effort**: Medium
- Create single `database.ts` module that exports configured Sequelize
- Import in all models instead of creating new instances
- Prevents connection pool exhaustion
- Will reduce codebase by ~50 lines

#### 3. Add Server-Side Authentication & Authorization ⚠️
**Impact**: CRITICAL
**Effort**: Hard
- Implement JWT tokens instead of cookies
- Create middleware to verify tokens on all admin routes
- Check user role on server before operations
- Current state: Any user can POST to admin endpoints

#### 4. Add Input Validation & Sanitization ⚠️
**Impact**: HIGH
**Effort**: Medium
- Use `joi` or `express-validator` for request validation
- Validate ALL incoming data
- Reject invalid requests before processing
- Sanitize string inputs

#### 5. Add Environment Configuration ✓
**Impact**: HIGH
**Effort**: Easy
- Create `config.ts` file with all constants
- Define `API_BASE_URL`, database credentials, ports
- Use environment variables
- Allow different configs per environment

### TIER 2: HIGH (Code Quality & Maintainability)

#### 6. Create API Service Layer ✓
**Impact**: HIGH
**Effort**: Hard
- Extract fetch logic into `src/services/api.ts`
- Centralize all API calls
- Add request interceptors for auth headers
- Single place to manage base URL
- Replace 20+ hardcoded fetch calls

#### 7. Refactor God Components ✓
**Impact**: MEDIUM
**Effort**: Hard
- Split ManageFilm (469 lines) into:
  - `FilmTable` - table rendering
  - `FilmForm` - add/edit form
  - `FilmModal` - modal wrapper
  - `useFilmData` - custom hook for data
- Split ManageShow (470 lines) similarly
- Makes testing easier

#### 8. Add Error Boundaries ✓
**Impact**: MEDIUM
**Effort**: Easy
- Create `ErrorBoundary.tsx` component
- Wrap route components
- Provide fallback UI
- Prevents full app crashes

#### 9. Fix Async/Await Issues ✓
**Impact**: MEDIUM
**Effort**: Easy
- Fix login function to properly await before returning
- Add proper error handling in async operations
- Ensure all promises are awaited

#### 10. Add Proper Logging ✓
**Impact**: MEDIUM
**Effort**: Easy
- Replace `console.log` with logging library (winston, pino)
- Add log levels (debug, info, warn, error)
- Disable SQL query logging in production
- Centralize error logging

### TIER 3: MEDIUM (Performance & Best Practices)

#### 11. Implement Pagination ✓
**Impact**: MEDIUM
**Effort**: Medium
- Add `limit` and `offset` parameters to all `GET` list endpoints
- Use Ant Design Table pagination component
- Backend implementation: Add pagination to findAll queries
- Affects: ManageFilm, ManageShow, ManageUser, ManageCategory, ManageTicket

#### 12. Add Loading States ✓
**Impact**: MEDIUM
**Effort**: Medium
- Show spinners while API calls pending
- Disable buttons during submission
- Show error messages instead of silent failures
- Use Ant Design Spin component

#### 13. Improve Type Safety ✓
**Impact**: MEDIUM
**Effort**: Hard
- Create interfaces for all request/response types
- Replace `any` with proper types
- Create `types/api.ts` file
- Enable strict TypeScript checks
- Add prop validation with PropTypes or Zod

#### 14. Add Query Optimization ✓
**Impact**: MEDIUM
**Effort**: Medium
- Use `attributes` in Sequelize to select specific fields
- Eager load only necessary associations
- Add database indexes on frequently queried fields
- Use `raw: true` for read-only queries

#### 15. Fix Role-Based Authorization ✓
**Impact**: MEDIUM
**Effort**: Easy
- Replace numeric codes (1, 2) with enums or constants
- Use `ROLE.ADMIN` instead of `2`
- Make adding new roles easier
- Create `types/roles.ts`

### TIER 4: NICE-TO-HAVE (UX & Completeness)

#### 16. Replace Browser Alerts ✓
**Impact**: LOW
**Effort**: Easy
- Use Ant Design `message` or `notification` components
- More professional UX
- Replace 2 instances of `alert()`

#### 17. Implement Review API & Components ✓
**Impact**: LOW
**Effort**: Hard
- Review model exists but not connected to API
- Add routes: `/review`, `/review/:filmId`
- Display reviews in FilmDetail page
- Allow users to add reviews

#### 18. Add Database Migrations ✓
**Impact**: LOW
**Effort**: Medium
- Use Sequelize migrations for schema changes
- Track database schema versions
- Allow rollback capability
- Create initial migration from current schema

#### 19. Add Environment-Specific Configs ✓
**Impact**: MEDIUM
**Effort**: Easy
- Create `config/development.ts`, `config/production.ts`
- Different API URLs per environment
- Database selection per environment
- Webpack env variables

#### 20. Add Comprehensive Comments ✓
**Impact**: LOW
**Effort**: Easy
- Document complex functions
- Add JSDoc comments to exports
- Explain business logic (2-hour show duration, etc.)

---

## 6. CURRENT ISSUES BY FILE

### Critical Issues Summary

| File | Issues | Severity |
|------|--------|----------|
| `src/server/server.ts` | Hardcoded credentials, hardcoded DB connection | CRITICAL |
| `src/server/models/*.ts` | Duplicate DB connection (8 files) | CRITICAL |
| `src/server/api/*.ts` | No input validation, no auth middleware, generic error handling | HIGH |
| `src/contexts/AuthenticateContext.tsx` | Async login bug, improper promise handling | HIGH |
| `src/pages/ManageFilm.tsx` | 469 lines (too large), hardcoded URLs (8+), TODO comment | HIGH |
| `src/pages/ManageShow.tsx` | 470 lines (too large), hardcoded URLs (9+) | HIGH |
| `src/pages/ManageUser.tsx` | 305 lines (large), hardcoded URLs (4+) | MEDIUM |
| `src/pages/ManageCategory.tsx` | 269 lines (large), hardcoded URLs (4+) | MEDIUM |
| `src/pages/Booking.tsx` | Using `alert()`, hardcoded seat count | MEDIUM |
| `src/pages/Payment.tsx` | Hardcoded URL (1), weak payment mock | MEDIUM |
| `src/contexts/BookingContext.tsx` | Insecure cookie storage, no validation | MEDIUM |
| `src/components/*.tsx` | Scattered API calls, hardcoded URLs | MEDIUM |

---

## 7. RECOMMENDED REFACTORING ROADMAP

### Phase 1: Security (Week 1)
- [ ] Move credentials to .env file
- [ ] Add environment configuration
- [ ] Consolidate database connection
- [ ] Add input validation middleware

### Phase 2: Architecture (Weeks 2-3)
- [ ] Create API service layer
- [ ] Add error boundaries
- [ ] Fix async/await issues
- [ ] Add proper logging

### Phase 3: Code Quality (Weeks 4-5)
- [ ] Refactor god components
- [ ] Add TypeScript interfaces
- [ ] Implement pagination
- [ ] Add loading states

### Phase 4: Enhancement (Week 6+)
- [ ] Add comprehensive tests
- [ ] Implement review system
- [ ] Add database migrations
- [ ] Optimize queries

---

## 8. CHECKLIST FOR PRODUCTION DEPLOYMENT

Before deploying to production, ensure:

- [ ] All hardcoded credentials removed
- [ ] Environment variables configured
- [ ] SSL/HTTPS enabled
- [ ] CORS properly restricted
- [ ] Authentication middleware on all admin routes
- [ ] Input validation on all endpoints
- [ ] Error boundaries in all routes
- [ ] Logging configured (no console.log spam)
- [ ] Database connection pooling configured
- [ ] Rate limiting implemented
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified
- [ ] CSRF protection added
- [ ] All TODO comments resolved
- [ ] Tests written for critical paths
- [ ] Performance tested (load testing)
- [ ] Database backed up and tested
- [ ] Deployment procedure documented

---

## 9. DEPENDENCY ANALYSIS

### Key Dependencies
- **React 18.3.1**: Good version, supports latest features
- **Ant Design 5.17.4**: Latest major version, well-maintained
- **Sequelize 6.37.3**: Mature ORM, well-documented
- **Express 4.19.2**: Current version
- **MySQL2 3.10.0**: Current driver

### Missing Useful Packages
- `dotenv`: Environment configuration
- `joi` or `express-validator`: Request validation
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT authentication
- `cors`: Already installed but not optimally configured
- `helmet`: Security headers
- `morgan`: HTTP request logging
- `winston` or `pino`: Structured logging
- `@types/*`: TypeScript definitions for all packages

---

## CONCLUSION

The cinema booking app is a **solid learning project** with good foundational architecture (React + Express + MySQL). However, it has **critical security vulnerabilities** and **architectural issues** that prevent it from being production-ready.

**Priority improvements:**
1. **Eliminate hardcoded credentials** (CRITICAL)
2. **Add backend authentication/authorization** (CRITICAL)
3. **Consolidate database connections** (HIGH)
4. **Create API service layer** (HIGH)
5. **Refactor large components** (MEDIUM)

The codebase is well-positioned for improvement - most issues are solvable through refactoring without redesign. Following the recommended roadmap would increase code quality, maintainability, and security significantly.

**Estimated refactoring effort**: 4-6 weeks for a single developer to address all issues comprehensively.

