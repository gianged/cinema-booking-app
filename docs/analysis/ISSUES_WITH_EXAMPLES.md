# Cinema Booking App - Issues with Code Examples

## 1. CRITICAL: Hardcoded Database Credentials

### The Problem
Database password exposed in source code across 8 files.

### Current Code (WRONG)
```typescript
// File: src/server/models/user.ts
const sequelize = new Sequelize("cinema-booking-app-db", "admin", "Giang@123", {
    host: "localhost",
    dialect: "mysql",
    dialectModule: require("mysql2"),
    port: 8000,
    logging: console.log,
});
```

### Recommended Solution
```typescript
// File: .env
DATABASE_NAME=cinema-booking-app-db
DATABASE_USER=admin
DATABASE_PASSWORD=your_secure_password_here
DATABASE_HOST=localhost
DATABASE_PORT=8000

// File: src/server/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DATABASE_NAME!,
    process.env.DATABASE_USER!,
    process.env.DATABASE_PASSWORD!,
    {
        host: process.env.DATABASE_HOST!,
        dialect: 'mysql',
        dialectModule: require('mysql2'),
        port: parseInt(process.env.DATABASE_PORT!),
        logging: false, // Disable in production
    }
);
```

### Files Affected
1. `src/server/server.ts` (line 24)
2. `src/server/models/user.ts` (line 3)
3. `src/server/models/film.ts` (line 3)
4. `src/server/models/show_schedule.ts` (line 4)
5. `src/server/models/ticket.ts` (line 5)
6. `src/server/models/category.ts` (line 3)
7. `src/server/models/film_category.ts` (line 6)
8. `src/server/models/review.ts` (line 5)

---

## 2. CRITICAL: Multiple Database Connection Instances

### The Problem
Each model file creates its own Sequelize connection, causing:
- Connection pool exhaustion
- Memory leaks
- Duplicate connections
- Synchronization issues

### Current Code (WRONG)
```typescript
// File: src/server/models/user.ts
const sequelize = new Sequelize("cinema-booking-app-db", "admin", "Giang@123", {...});

// File: src/server/models/film.ts
const sequelize = new Sequelize("cinema-booking-app-db", "admin", "Giang@123", {...});

// File: src/server/models/ticket.ts
const sequelize = new Sequelize("cinema-booking-app-db", "admin", "Giang@123", {...});
// ...and 5 more times!
```

### Recommended Solution
```typescript
// File: src/server/database.ts (single source of truth)
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
    process.env.DATABASE_NAME!,
    process.env.DATABASE_USER!,
    process.env.DATABASE_PASSWORD!,
    {
        host: process.env.DATABASE_HOST!,
        dialect: 'mysql',
        dialectModule: require('mysql2'),
        port: parseInt(process.env.DATABASE_PORT!),
    }
);

// File: src/server/models/user.ts
import { sequelize } from '../database'; // Import instead of creating new

export class User extends Model { ... }
User.init({ ... }, { sequelize, modelName: 'User', ... });

// File: src/server/models/film.ts
import { sequelize } from '../database'; // Same instance

export class Film extends Model { ... }
Film.init({ ... }, { sequelize, modelName: 'Film', ... });
```

---

## 3. CRITICAL: No Backend Authentication/Authorization

### The Problem
Admin routes have zero server-side authorization. Any authenticated user can:
- Delete any film, category, or user
- Create admin accounts
- Modify ticket prices
- Access all admin endpoints

Client-side role check is EASILY bypassed by:
1. Modifying cookie in browser
2. Direct API calls with curl/Postman
3. Network proxies

### Current Code (WRONG)
```typescript
// File: src/server/api/filmRoute.ts
router.post("/film", async (req, res) => {
    // NO AUTHORIZATION CHECK!
    try {
        const {filmName, filmDescription, poster, ...} = req.body;
        const film = await Film.create({...});
        return res.json(film);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Server-side error"});
    }
});

// ANY user can POST to this endpoint and create films!
```

### Current Client-Side Check (Insufficient)
```typescript
// File: src/pages/ManageFilm.tsx
export const ManageFilm: React.FC = () => {
    // This check is USELESS - can be bypassed!
    // Client-side checks provide zero security
    
    const tableColumns = [...];
    const [tableData, setTableData] = useState([...]);
    // ...form logic...
};
```

### Recommended Solution
```typescript
// File: src/server/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: { id: number; role: string };
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({message: "Unauthorized"});
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded as any;
        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid token"});
    }
};

export const authorize = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({message: "Forbidden"});
        }
        next();
    };
};

// File: src/server/api/filmRoute.ts
import { authenticate, authorize } from '../middleware/auth';

router.post("/film", authenticate, authorize("admin"), async (req, res) => {
    // NOW it's protected!
    try {
        const {filmName, filmDescription, poster, ...} = req.body;
        const film = await Film.create({...});
        return res.json(film);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Server-side error"});
    }
});
```

---

## 4. HIGH: Hardcoded API Endpoints (20+ locations)

### The Problem
`http://localhost:4000` hardcoded throughout the codebase makes:
- Changing backend URL impossible
- Testing on different environments difficult
- Deploying to production impossible

### Current Code (WRONG)
```typescript
// File: src/pages/ManageFilm.tsx (line 36)
const categoryList = async () => {
    const response = await fetch("http://localhost:4000/category/active", {
        method: "GET"
    });
    const data = await response.json();
    return data;
};

// File: src/pages/ManageShow.tsx (line 38)
const showList = async () => {
    const response = await fetch("http://localhost:4000/show", {
        method: "GET"
    });
    const data = await response.json();
    return data;
};

// File: src/contexts/AuthenticateContext.tsx (line 41)
const getUser = async (username: string, password: string) => {
    const response = await fetch("http://localhost:4000/security/login", {
        method: "POST",
        ...
    });
    const data = await response.json();
    return data;
};

// Found in 17+ more files!
```

### Recommended Solution
```typescript
// File: src/config/api.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const API = {
    BASE_URL: API_BASE_URL,
    ENDPOINTS: {
        AUTH: {
            LOGIN: `${API_BASE_URL}/security/login`,
            REGISTER: `${API_BASE_URL}/security/register`,
            LOGOUT: `${API_BASE_URL}/security/logout`,
        },
        FILMS: {
            LIST: `${API_BASE_URL}/film`,
            GET: (id: number) => `${API_BASE_URL}/film/${id}`,
            CURRENT: `${API_BASE_URL}/film/currentshow`,
            CREATE: `${API_BASE_URL}/film`,
            UPDATE: (id: number) => `${API_BASE_URL}/film/${id}`,
            DELETE: (id: number) => `${API_BASE_URL}/film/${id}`,
        },
        CATEGORIES: {
            LIST: `${API_BASE_URL}/category`,
            ACTIVE: `${API_BASE_URL}/category/active`,
            GET: (id: number) => `${API_BASE_URL}/category/${id}`,
        },
        SHOWS: {
            LIST: `${API_BASE_URL}/show`,
            GET: (id: number) => `${API_BASE_URL}/show/${id}`,
            BY_FILM: (filmId: number) => `${API_BASE_URL}/show/active/${filmId}`,
        },
        TICKETS: {
            LIST: `${API_BASE_URL}/ticket`,
            USER: (userId: number) => `${API_BASE_URL}/ticket/userview/${userId}`,
        },
    }
};

// File: .env.local
REACT_APP_API_URL=http://localhost:4000

// File: src/pages/ManageFilm.tsx
import { API } from '../config/api';

const categoryList = async () => {
    const response = await fetch(API.ENDPOINTS.CATEGORIES.ACTIVE);
    return await response.json();
};

// File: src/pages/ManageShow.tsx
import { API } from '../config/api';

const showList = async () => {
    const response = await fetch(API.ENDPOINTS.SHOWS.LIST);
    return await response.json();
};
```

### Files Affected (20+)
- `src/pages/ManageFilm.tsx` (8 occurrences)
- `src/pages/ManageShow.tsx` (9 occurrences)
- `src/pages/ManageUser.tsx` (4 occurrences)
- `src/pages/ManageCategory.tsx` (4 occurrences)
- `src/pages/ManageTicket.tsx` (1 occurrence)
- `src/pages/Payment.tsx` (1 occurrence)
- `src/pages/TicketView.tsx` (1 occurrence)
- `src/contexts/AuthenticateContext.tsx` (1 occurrence)
- `src/components/FilmCard.tsx` (1 occurrence)
- `src/components/FilmSchedule.tsx` (1 occurrence)

---

## 5. HIGH: Async/Await Bug in Login Function

### The Problem
Login function returns false immediately while async operation is still pending, creating race conditions.

### Current Code (WRONG)
```typescript
// File: src/contexts/AuthenticateContext.tsx (lines 72-98)
const login = (username: string, password: string): boolean => {
    getUser(username, password).then((data) => {  // Async operation starts
        if (!data.hasOwnProperty("id")) {
            setLoginError("Username or password is incorrect");
            return false;  // Returns from promise, not function!
        } else if (data.isActive === 0) {
            setLoginError("Your account is disabled");
            return false;
        } else if (data.isActive === 1) {
            setLoginError(null);
            setIsLogin(true);      // Updates state AFTER return
            id.current = data.id;
            // ...
            return true;
        }
    });
    return false;  // Returns BEFORE promise resolves!
};

// File: src/pages/LoginPage.tsx (line 23)
onFinish={(values) => {
    authetication.login(values.username, values.password);
    if (authetication.isLogin) navigate("/");  // ALWAYS false!
}}
```

### Problems This Causes
1. Login always returns false immediately
2. `isLogin` state updates after function returns
3. Navigation never happens
4. No proper error feedback
5. Race conditions if user tries multiple logins

### Recommended Solution
```typescript
// File: src/contexts/AuthenticateContext.tsx
interface AuthenticateContextType {
    isLogin: boolean;
    setIsLogin: Dispatch<SetStateAction<boolean>>;
    role?: MutableRefObject<number>;
    login: (username: string, password: string) => Promise<boolean>;  // NOW ASYNC!
    logout: () => void;
    id?: MutableRefObject<number | undefined>;
    displayName?: MutableRefObject<string | undefined>;
    loginError: string | null;
    setLoginError: Dispatch<SetStateAction<string | null>>;
}

const getUser = async (username: string, password: string) => {
    const response = await fetch(API.ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password}),
    });
    
    if (!response.ok) {
        throw new Error("Login failed");
    }
    return await response.json();
};

export const AuthenticateProvider = ({children}: {children: ReactElement}) => {
    // ... state declarations ...
    
    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const data = await getUser(username, password);
            
            if (!data.hasOwnProperty("id")) {
                setLoginError("Username or password is incorrect");
                return false;
            } else if (data.isActive === 0) {
                setLoginError("Your account is disabled");
                return false;
            } else if (data.isActive === 1) {
                setLoginError(null);
                setIsLogin(true);
                id.current = data.id;
                displayName.current = data.username;
                role.current = data.role === "a" ? 2 : 1;
                setAuthenticateCookie("authenticate", {
                    id: id.current,
                    displayName: displayName.current,
                    role: role.current,
                });
                return true;  // Returns AFTER state is set
            }
        } catch (error) {
            setLoginError("Server error, please try again");
            return false;
        }
    };
    
    return (...);
};

// File: src/pages/LoginPage.tsx
onFinish={async (values) => {
    const success = await authetication.login(values.username, values.password);
    if (success) {
        navigate("/");
    }
}}
```

---

## 6. HIGH: God Components (Too Large)

### The Problem
ManageFilm (469 lines) and ManageShow (470 lines) mix too many concerns:
- Data fetching
- Form handling
- Table rendering
- Modal management
- Search filtering

Hard to test, maintain, and reuse.

### Current Structure (WRONG)
```typescript
// File: src/pages/ManageFilm.tsx (469 lines)
export const ManageFilm: React.FC = () => {
    const tableColumns: TableColumnsType<TableDataType> = [...]; // 200+ lines
    const [tableData, setTableData] = useState([...]);
    const [searchedTableData, setSearchedTableData] = useState([...]);
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [selectFilmId, setSelectFilmId] = useState(null);
    const [categorySelectList, setCategorySelectList] = useState([]);
    const [formUpdate] = Form.useForm();
    
    // Data fetching
    useEffect(() => { filmList().then(...) }, [...]);
    useEffect(() => { categoryList().then(...) }, []);
    
    // Search logic
    const searchInput = (e) => { ... };
    
    // Form updates
    const setFormUpdateData = (id) => { ... };
    
    // Component rendering (200+ lines of JSX)
    return (
        <>
            <Row className="topRow">...</Row>
            <Table columns={tableColumns} ... />
            <Modal className="modalAdd" ... >
                <Form ... >...</Form>
            </Modal>
            <Modal className="modalUpdate" ... >
                <Form ... >...</Form>
            </Modal>
            <Modal className="modalDelete" ... >...</Modal>
        </>
    );
};
```

### Recommended Solution
```typescript
// File: src/hooks/useFilmData.ts
export const useFilmData = () => {
    const [tableData, setTableData] = useState<TableDataType[]>([]);
    const [searchedTableData, setSearchedTableData] = useState<TableDataType[]>([]);
    const [categorySelectList, setCategorySelectList] = useState<any[]>([]);
    
    useEffect(() => {
        filmList().then((data: any) => {
            data.forEach((item: any) => {
                item.poster = displayImageFromBuffer(item.poster?.data);
                item.backdrop = displayImageFromBuffer(item.backdrop?.data);
            });
            setTableData(data);
            setSearchedTableData(data);
        });
    }, []);
    
    useEffect(() => {
        categoryList().then(setCategorySelectList);
    }, []);
    
    const searchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const filterTableData = tableData.filter((data) =>
            data.filmName.toLowerCase().includes(value)
        );
        setSearchedTableData(filterTableData);
    };
    
    return {
        tableData,
        searchedTableData,
        categorySelectList,
        searchInput,
    };
};

// File: src/components/FilmTable.tsx
interface FilmTableProps {
    data: TableDataType[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export const FilmTable: React.FC<FilmTableProps> = ({
    data,
    onEdit,
    onDelete,
}) => {
    const tableColumns: TableColumnsType<TableDataType> = [...];
    return <Table columns={tableColumns} dataSource={data} ... />;
};

// File: src/components/FilmFormModal.tsx
interface FilmFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    categories: any[];
    initialData?: TableDataType;
}

export const FilmFormModal: React.FC<FilmFormModalProps> = ({
    open,
    onClose,
    onSubmit,
    categories,
    initialData,
}) => {
    return (
        <Modal open={open} onCancel={onClose} footer={null}>
            <Form onFinish={onSubmit}>
                {/* Form fields */}
            </Form>
        </Modal>
    );
};

// File: src/pages/ManageFilm.tsx (NOW ONLY 100 lines)
export const ManageFilm: React.FC = () => {
    const { tableData, searchedTableData, categorySelectList, searchInput } =
        useFilmData();
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
    const [selectFilmId, setSelectFilmId] = useState<number | null>(null);
    
    const handleEdit = (id: number) => {
        setSelectFilmId(id);
        setModalUpdateOpen(true);
    };
    
    const handleDelete = (id: number) => {
        setSelectFilmId(id);
        // Show delete confirmation
    };
    
    return (
        <>
            <Row className="topRow">
                <Button onClick={() => setModalAddOpen(true)}>
                    Add Film
                </Button>
                <Input onChange={searchInput} placeholder="Search..." />
            </Row>
            
            <FilmTable
                data={searchedTableData}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            
            <FilmFormModal
                open={modalAddOpen}
                onClose={() => setModalAddOpen(false)}
                onSubmit={handleAddFilm}
                categories={categorySelectList}
            />
            
            <FilmFormModal
                open={modalUpdateOpen}
                onClose={() => setModalUpdateOpen(false)}
                onSubmit={handleUpdateFilm}
                categories={categorySelectList}
                initialData={tableData.find(f => f.id === selectFilmId)}
            />
        </>
    );
};
```

---

## 7. MEDIUM: No Input Validation on Backend

### The Problem
Routes accept any data without validation, creating:
- SQL injection vulnerabilities
- Invalid data in database
- Silent failures

### Current Code (WRONG)
```typescript
// File: src/server/api/userRoute.ts (lines 77-99)
router.post("/user", async (req, res) => {
    try {
        const {username, password, role, isActive} = req.body;
        // NO VALIDATION!
        // What if username is missing? What if role is invalid?
        // What if password is 1 character?
        
        const hashPassword = sha512(password);
        const check = await User.findOne({where: {username: username}});
        if (check) {
            return res.status(400).json({message: "User already exists"});
        }
        const idUser = await User.findOne({order: [["id", "DESC"]]});
        const newId = idUser ? idUser.id + 1 : 1;
        const user = await User.create({
            id: newId,
            username: username,
            password: hashPassword,
            role: role,  // Could be any string!
            isActive: isActive,  // Could be any value!
        });
        return res.json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Server-side error"});
    }
});
```

### Recommended Solution
```typescript
// File: src/server/middleware/validation.ts
import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
};

export const userValidation = [
    body('username')
        .isString()
        .trim()
        .isLength({min: 3, max: 50})
        .withMessage('Username must be 3-50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('password')
        .isString()
        .isLength({min: 8})
        .withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/)
        .withMessage('Password must contain uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain lowercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain number'),
    body('role')
        .isIn(['a', 'u'])
        .withMessage('Invalid role'),
    body('isActive')
        .isInt({min: 0, max: 1})
        .withMessage('isActive must be 0 or 1'),
];

// File: src/server/api/userRoute.ts
import { validate, userValidation } from '../middleware/validation';

router.post('/user', userValidation, validate, async (req, res) => {
    // NOW input is guaranteed to be valid
    try {
        const {username, password, role, isActive} = req.body;
        // ... safe to use ...
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Server error"});
    }
});
```

---

## Summary of Issues

| Issue | Severity | Locations | Effort to Fix |
|-------|----------|-----------|---------------|
| Hardcoded Credentials | CRITICAL | 8 files | 30 min |
| Multiple DB Connections | CRITICAL | 8 files | 45 min |
| No Backend Auth | CRITICAL | 5 route files | 2 hours |
| No Input Validation | CRITICAL | 5 route files | 2 hours |
| Hardcoded URLs | HIGH | 10+ files | 2 hours |
| Async/Await Bug | HIGH | 2 files | 30 min |
| God Components | MEDIUM | 2 files | 4 hours |
| No Pagination | MEDIUM | 5 pages | 3 hours |
| No Error Boundaries | MEDIUM | App.tsx | 30 min |
| No Type Safety | MEDIUM | Multiple | 8+ hours |

**Total estimated effort**: 24-30 hours to fix all issues comprehensively

