# 🚀 Setup Guide

Complete guide to setting up the Cinema Booking App for development.

---

## 📋 Prerequisites

### Required Software
- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **MySQL** v8 or higher ([Download](https://dev.mysql.com/downloads/))
- **npm** v7 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Optional Tools
- **VS Code** - Recommended IDE ([Download](https://code.visualstudio.com/))
- **Postman** - For API testing ([Download](https://www.postman.com/))
- **MySQL Workbench** - For database management ([Download](https://www.mysql.com/products/workbench/))

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/gianged/cinema-booking-app.git
cd cinema-booking-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React & React Router
- Fastify & plugins
- TypeScript
- Sequelize (ORM)
- Ant Design (UI)
- Development tools (ESLint, Prettier, etc.)

### 3. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
NODE_ENV=development
SERVER_HOST=localhost
SERVER_PORT=4000

# Database Configuration
DB_NAME=cinema-booking-app-db
DB_USER=admin
DB_PASSWORD=your_secure_password_here
DB_HOST=localhost
DB_PORT=8000
DB_DIALECT=mysql

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

**⚠️ Important:**
- Change `DB_PASSWORD` to your MySQL password
- Generate a strong `JWT_SECRET` for production
- Never commit `.env` to version control

### 4. Set Up the Database

#### Create Database

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE `cinema-booking-app-db`;

-- Verify
SHOW DATABASES;
```

#### Import Schema

Download the database schema from [Google Drive](https://drive.google.com/file/d/10B-n6azZo5ZJ_nDhsG7SfksXAMIHUQnx/view?usp=sharing) and import it:

```bash
mysql -u admin -p cinema-booking-app-db < database-schema.sql
```

---

## ▶️ Running the Application

### Development Mode (Recommended)

Run both frontend and backend with hot reload:

```bash
npm run dev
```

This starts:
- **Backend (Fastify):** http://localhost:4000
- **Frontend (React):** http://localhost:3000

### Run Frontend Only

```bash
npm start
```

### Run Backend Only

```bash
npm run server:dev
```

---

## ✅ Verification

### 1. Check Backend Health

Visit: http://localhost:4000/health

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Check Database Connection

Look for this in backend logs:
```
✓ Database connection established successfully
  Connected to: cinema-booking-app-db@localhost:8000
```

### 3. Check Frontend

Visit: http://localhost:3000

You should see the Cinema Booking App home page.

---

## 🔧 VS Code Setup (Recommended)

### Install Extensions

1. **ESLint** - `dbaeumer.vscode-eslint`
2. **Prettier** - `esbenp.prettier-vscode`
3. **TypeScript** - Built-in
4. **SCSS IntelliSense** - `mrmlnc.vscode-scss`

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## 🐛 Troubleshooting

### Database Connection Failed

**Error:** `Unable to connect to the database`

**Solution:**
1. Check MySQL is running: `sudo service mysql status`
2. Verify credentials in `.env`
3. Ensure database exists: `SHOW DATABASES;`
4. Check MySQL port (default: 8000 in config)

### Port Already in Use

**Error:** `Port 4000 is already in use`

**Solution:**
```bash
# Find and kill process using port 4000
lsof -ti:4000 | xargs kill -9

# Or change port in .env
SERVER_PORT=4001
```

### Module Not Found

**Error:** `Cannot find module 'X'`

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

**Error:** Type checking errors

**Solution:**
```bash
# Run type check
npm run type-check

# Fix auto-fixable issues
npm run lint:fix
```

---

## 🌐 Environment-Specific Setup

### Development
- Use `.env` file
- Enable debug logging
- Hot reload enabled
- Source maps enabled

### Production
- Use environment variables (not `.env` file)
- Set `NODE_ENV=production`
- Disable debug logging
- Build optimized bundle
- Use strong JWT secret
- Enable HTTPS
- Configure proper CORS

---

## 📝 Next Steps

After setup is complete:

1. **Read the development guide:** [DEVELOPMENT.md](./DEVELOPMENT.md)
2. **Understand the project structure:** [../architecture/PROJECT_STRUCTURE.md](../architecture/PROJECT_STRUCTURE.md)
3. **Review API documentation:** [../api/ENDPOINTS.md](../api/ENDPOINTS.md)
4. **Start coding!** 🎉

---

## 🆘 Getting Help

If you're still stuck:
- Check the [troubleshooting section](#troubleshooting)
- Review the [main README](../../README.md)
- Search existing issues on GitHub
- Create a new issue with:
  - Your environment (OS, Node version, MySQL version)
  - Steps to reproduce
  - Error messages
  - Screenshots if applicable

---

**Ready to develop? Head to the [Development Guide](./DEVELOPMENT.md)!** 🚀
