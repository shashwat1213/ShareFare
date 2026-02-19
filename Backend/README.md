# SHAREFAR.AI - Backend API

A production-ready Node.js + Express + PostgreSQL backend for SHAREFAR.AI platform.

## 📋 Project Overview

SHAREFAR.AI is a scalable backend API built with industry best practices. It provides RESTful endpoints for managing core business logic with PostgreSQL as the primary database.

**Version:** 1.0.0  
**Environment:** Node.js v14+ | PostgreSQL 12+  
**License:** ISC

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Node.js** | JavaScript runtime | v14+ |
| **Express.js** | Web framework | ^4.18.2 |
| **PostgreSQL** | Relational database | 12+ |
| **pg** | PostgreSQL client | ^8.10.0 |
| **dotenv** | Environment variables | ^16.3.1 |
| **cors** | CORS middleware | ^2.8.5 |
| **nodemon** | Development auto-reload | ^3.0.2 |

---

## 📁 Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   └── db.js                 # PostgreSQL connection pool
│   ├── controllers/
│   │   └── healthController.js   # Business logic handlers
│   ├── routes/
│   │   └── healthRoutes.js       # API endpoint definitions
│   ├── models/                   # Database models (empty - add your models)
│   ├── middlewares/              # Custom middlewares (empty - ready for use)
│   └── server.js                 # Main Express server
├── node_modules/                 # Dependencies (auto-generated)
├── .env                          # Environment variables (local)
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore patterns
├── package.json                  # Project metadata & dependencies
└── README.md                     # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 12+ running locally ([Download](https://www.postgresql.org/download/))
- **npm** v6+ (comes with Node.js)
- **Git** (optional)

### Installation

1. **Navigate to Backend folder:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` (or create `.env` file)
   - Update with your PostgreSQL credentials:
     ```
     DB_USER=postgres
     DB_PASSWORD=your_password
     DB_HOST=localhost
     DB_NAME=sharefar
     DB_PORT=5432
     PORT=5000
     ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Output should show:
   ```
   ╔════════════════════════════════════════════════╗
   ║  SHAREFAR.AI Backend Server                    ║
   ║  Running on http://localhost:5000              ║
   ║  Environment: development                      ║
   ╚════════════════════════════════════════════════╝
   ```

---

## 📦 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm start` | Run production server |
| `npm run dev` | Run development server with auto-reload |

---

## 🔌 API Endpoints

### Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-02-18T10:30:00.000Z",
  "uptime": 45.234,
  "environment": "development",
  "message": "Server is running"
}
```

### Database Connection Test
```http
GET /api/db-test
```
**Response (Success):**
```json
{
  "status": "OK",
  "message": "Database connection successful",
  "database": "sharefar",
  "host": "localhost"
}
```

**Response (Error):**
```json
{
  "status": "ERROR",
  "message": "Database connection failed",
  "error": "connection error details"
}
```

### Welcome Endpoint
```http
GET /
```
**Response:**
```json
{
  "message": "Welcome to SHAREFAR.AI Backend API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "dbTest": "/api/db-test"
  }
}
```

---

## 🗄️ Database Setup

### Create PostgreSQL Database

1. **Connect to PostgreSQL:**
   ```bash
   psql -U postgres
   ```

2. **Create database (if not exists):**
   ```sql
   CREATE DATABASE sharefar;
   ```

3. **Verify connection:**
   ```sql
   \l
   ```

### Connection Details

Default configuration in `.env`:
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=sharefar
DB_PASSWORD=your_password
DB_PORT=5432
```

---

## 🏗️ Architecture Pattern

### MVC (Model-View-Controller)

- **Models** (`/src/models/`) - Database schemas and queries
- **Views** - API responses (JSON)
- **Controllers** (`/src/controllers/`) - Business logic & request handlers

### Key Features

✅ **Modular Routes** - Separated route files for each feature  
✅ **Centralized DB Config** - Single database connection management  
✅ **Async/Await** - Modern async error handling  
✅ **Connection Pooling** - Efficient database resource management  
✅ **Error Handling** - Try/catch blocks with proper HTTP status codes  
✅ **CORS** - Cross-origin request support  
✅ **Environment Variables** - Secure configuration management  
✅ **Graceful Shutdown** - Proper resource cleanup on process exit  

---

## 🔒 Security Practices

1. **Environment Variables** - Sensitive data in `.env` (not in version control)
2. **CORS** - Configured to prevent unauthorized cross-origin requests
3. **.gitignore** - Prevents committing secrets and dependencies
4. **Input Validation** - Ready for adding validation middleware
5. **Error Handling** - No sensitive info in error responses

---

## 📝 Environment Configuration (.env)

Create `.env` file in the Backend root:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=sharefar
DB_PASSWORD=your_password
DB_PORT=5432
```

⚠️ **Never commit `.env` to version control!**

---

## 🧪 Testing API Endpoints

### Using cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Database test
curl http://localhost:5000/api/db-test
```

### Using Postman

1. Open Postman
2. Create new GET request
3. Enter: `http://localhost:5000/api/health`
4. Click "Send"

### Using VS Code REST Client Extension

Create `requests.http` file:
```http
### Health Check
GET http://localhost:5000/api/health

### Database Test
GET http://localhost:5000/api/db-test
```

---

## 📚 Project Development Roadmap

- [ ] Add user authentication (JWT)
- [ ] Add request validation (joi/express-validator)
- [ ] Add logging (winston)
- [ ] Add database migrations
- [ ] Add unit tests (Jest)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add rate limiting
- [ ] Add caching (Redis)
- [ ] Add error tracking (Sentry)
- [ ] Setup CI/CD pipeline

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'pg'"
**Solution:** Run `npm install` to install dependencies

### Issue: "Database connection failed"
**Solution:** 
- Verify PostgreSQL is running
- Check `.env` credentials match your PostgreSQL setup
- Ensure database `sharefar` exists

### Issue: "Port 5000 already in use"
**Solution:** Change `PORT` in `.env` to another number (e.g., 5001)

### Issue: PowerShell execution policy error
**Solution:** Use `npm.cmd install` instead of `npm install`

---

## 📖 Adding New Features

### Create a New Route

1. **Create controller** (`src/controllers/userController.js`):
   ```javascript
   exports.getUsers = async (req, res) => {
     try {
       res.json({ message: 'Get all users' });
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   };
   ```

2. **Create routes** (`src/routes/userRoutes.js`):
   ```javascript
   const express = require('express');
   const userController = require('../controllers/userController');
   const router = express.Router();
   
   router.get('/', userController.getUsers);
   
   module.exports = router;
   ```

3. **Mount in server.js**:
   ```javascript
   const userRoutes = require('./routes/userRoutes');
   app.use('/api/users', userRoutes);
   ```

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/feature-name`
4. Submit a pull request

---

## 📄 License

ISC

---

## 👨‍💼 Support

For issues or questions, please open an issue or contact the development team.

---

**Happy Coding! 🚀**
