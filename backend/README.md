# ContactX - Express & MongoDB Backend

This is the dedicated backend service for **ContactX**, built with **Node.js**, **Express**, and **MongoDB (Mongoose ODM)**.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Local MongoDB Community Server or MongoDB Atlas Cloud)
- **ODM**: Mongoose
- **Authentication**: JWT & bcryptjs password hashing
- **Security & Utilities**: CORS, dotenv, nodemon

---

## 📁 Directory Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection logic
├── controllers/
│   ├── authController.js     # User registration, login & demo auth
│   └── contactController.js  # Contact CRUD, search, sort, filter & stats
├── middleware/
│   └── errorHandler.js       # Centralized JSON error handling
├── models/
│   ├── Contact.js            # Mongoose Contact schema with validations
│   └── User.js               # Mongoose User schema with bcrypt hashing
├── routes/
│   ├── authRoutes.js         # Authentication endpoints
│   ├── contactRoutes.js      # Contact endpoints
│   └── statsRoutes.js        # Analytics endpoints
├── .env                      # Local environment configuration
├── .env.example              # Template for environment variables
├── package.json              # Backend dependencies & npm scripts
└── server.js                 # Server entrypoint
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Verify or edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/contactx
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000
```
> **Note for MongoDB Atlas Users**: If using MongoDB Atlas in the cloud, replace `MONGODB_URI` with your connection string:
> `mongodb+srv://<username>:<password>@cluster0.mongodb.net/contactx?retryWrites=true&w=majority`

### 3. Start the Backend Server
```bash
# Development mode with hot-reloading (nodemon)
npm run dev

# Or standard production mode
npm start
```

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth` | Unified handler (supports `{ action: 'login' \| 'signup' \| 'demo' }`) |
| `POST` | `/api/auth/login` | Login with email & password |
| `POST` | `/api/auth/register` | Register a new user |

### 📇 Contacts (`/api/contacts`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/contacts` | Get contacts (supports `?q=`, `?field=`, `?favorites=true`, `?sort=name\|phone\|dateAdded`, `?order=asc\|desc`) |
| `POST` | `/api/contacts` | Create a new contact (with 10-digit phone & duplicate validation) |
| `PUT` | `/api/contacts` | Update an existing contact |
| `DELETE` | `/api/contacts?phone=...` | Delete a contact |
| `POST` | `/api/contacts/toggle-favorite`| Toggle favorite status |
| `POST` | `/api/contacts/reset` | Reset database to default sample dataset |
| `GET` | `/api/contacts/raw-file` | Export contacts as pipe-delimited text (`contacts.txt` format) |
| `POST` | `/api/contacts/raw-file` | Import pipe-delimited text into MongoDB |

### 📊 System & Statistics
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/statistics` | Get aggregate totals, favorites count, and storage info |
| `GET` | `/api/health` | System health check (MongoDB connection status) |

