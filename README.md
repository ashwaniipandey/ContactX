# ContactX - Full-Stack Contact Management System

**ContactX** is an enterprise-grade full-stack contact management application transformed from a C++ terminal DSA program into a modern, distributed web platform powered by **Next.js 15 (React 19)** on the frontend, a dedicated **Express.js** REST API in the backend, and **MongoDB** for real-time indexed persistent storage.

---

## 🏛️ System Architecture

```
                    ┌─────────────────────────────────────────┐
                    │          Frontend (Port 3000)           │
                    │   Next.js 15 • React 19 • Glassmorphic  │
                    └───────────────────┬─────────────────────┘
                                        │ (Proxy /api/* rewrites)
                                        ▼
                    ┌─────────────────────────────────────────┐
                    │          Backend (Port 5001)            │
                    │      Node.js • Express.js • JWT         │
                    └──────────┬──────────────────┬───────────┘
                               │                  │
               (Mongoose ODM)  ▼                  ▼  (File IO)
        ┌───────────────────────────────┐   ┌───────────────────────────┐
        │       MongoDB Database        │   │       contacts.txt        │
        │   Collections: contacts, users│   │   Legacy C++ Pipe Sync    │
        └───────────────────────────────┘   └───────────────────────────┘
```

---

## 🚀 Key Features

### 1. 🎨 Modern Next.js Frontend
- **Dual View Modes**: Rich interactive Card Grid and high-density Table View.
- **Glassmorphic UI**: Calibrated dark 🌙 and light ☀️ themes with real-time toggle and localStorage persistence.
- **User Authentication**: Secure Sign Up, Login, and 1-Click Instant Demo login with JWT.
- **Live DSA HUD**: Real-time Big-O metrics, milliseconds execution duration, and comparison counter.
- **Dynamic Modals**: Add contact, edit contact with 10-digit validation, deletion confirmation, and raw file editor.

### 2. ⚡ Express.js REST API Backend
- **Dedicated Service**: Clean architectural separation in `/backend`.
- **Modular Design**: MVC structure (`config/`, `controllers/`, `models/`, `routes/`, `middleware/`).
- **RESTful Endpoints**: Full CRUD, favorite toggling, statistics aggregation, and raw-file sync.
- **Robust Error Handling**: Centralized JSON error middleware and CORS support.

### 3. 🍃 MongoDB Database Layer
- **Persistent Storage**: Mongoose schemas with field constraints, lowercase emails, and 10-digit regex phone validation.
- **B-Tree Indexes**: Indexed by `name`, unique `phone`, and `email` for $O(1)$ and $O(\log N)$ retrieval.
- **User Security**: User model with automated `bcryptjs` password hashing and JWT token generation.
- **Auto-Seeding**: Automatically seeds default sample contacts on fresh setup.

### 4. ⚙️ C++ Terminal DSA Engine (`ContactHub/`)
- Preserves the original C++ implementation utilizing `std::vector<Contact>`, linear search algorithms, and comparator sorting.
- Shares pipe-delimited data compatibility (`contacts.txt`) with the web application.

---

## 📂 Project Directory Structure

```
ContactHub/
├── backend/                        # Dedicated Express & MongoDB Backend
│   ├── config/
│   │   └── db.js                   # Mongoose database connection
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic (JWT + bcrypt)
│   │   └── contactController.js    # Contact CRUD & MongoDB aggregations
│   ├── middleware/
│   │   └── errorHandler.js         # Centralized JSON error handler
│   ├── models/
│   │   ├── Contact.js              # Mongoose Contact schema with validations
│   │   └── User.js                 # Mongoose User schema with bcrypt
│   ├── routes/
│   │   ├── authRoutes.js           # Auth routes (/api/auth)
│   │   ├── contactRoutes.js        # Contact routes (/api/contacts)
│   │   └── statsRoutes.js          # Analytics routes (/api/statistics)
│   ├── .env                        # Backend environment configuration
│   ├── .env.example
│   ├── package.json
│   └── server.js                   # Express application entrypoint
│
├── src/                            # Frontend Next.js 15 Application
│   ├── app/
│   │   ├── globals.css             # Glassmorphic responsive styling
│   │   ├── layout.js               # Metadata & root layout
│   │   └── page.js                 # Contact dashboard & state management
│   ├── components/                 # Modals, Cards, Table, HUD & Navigation
│   └── lib/dsa/                    # DSA implementations & file sync logic
│
├── ContactHub/                     # Original C++ Terminal Application
│   ├── Contact.h / Contact.cpp
│   ├── ContactManager.h / .cpp
│   ├── main.cpp
│   └── contacts.txt
│
├── next.config.mjs                 # Next.js rewrites proxy to backend (Port 5001)
├── package.json                    # Root package scripts (concurrently dev:all)
└── contacts.txt                    # Root shared disk persistence
```

---

## 🖥️ How to Run

### 1. Run Everything with One Command (Frontend + Backend)
From the project root:
```bash
npm run dev:all
```
- **Frontend** runs on **[http://localhost:3000](http://localhost:3000)**
- **Backend API** runs on **[http://localhost:5001/api](http://localhost:5001/api)**
- Next.js automatically proxies all `/api/*` requests directly to Express & MongoDB!

### 2. Run Individually

**Start Backend Only:**
```bash
# From root:
npm run backend

# Or inside backend directory:
cd backend
npm run dev
```

**Start Frontend Only:**
```bash
npm run dev
```

### 3. Run Original C++ Terminal App
```bash
cd ContactHub
g++ -std=c++11 main.cpp Contact.cpp ContactManager.cpp -o ContactHub.exe
./ContactHub.exe
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend and MongoDB health status |
| `POST` | `/api/auth` | Unified Auth (login / signup / demo) |
| `POST` | `/api/auth/login` | User login (returns JWT token) |
| `POST` | `/api/auth/register` | New user registration |
| `GET` | `/api/contacts` | Search, filter, and sort contacts from MongoDB |
| `POST` | `/api/contacts` | Add new contact to MongoDB (10-digit & unique check) |
| `PUT` | `/api/contacts` | Update existing contact in MongoDB |
| `DELETE` | `/api/contacts?phone=...` | Delete contact from MongoDB |
| `POST` | `/api/contacts/toggle-favorite`| Toggle favorite status |
| `POST` | `/api/contacts/reset` | Reset MongoDB to default sample dataset |
| `GET` | `/api/contacts/raw-file` | Export contacts as pipe-delimited text |
| `POST` | `/api/contacts/raw-file` | Synchronize raw text into MongoDB |
| `GET` | `/api/statistics` | Aggregate database metrics and counts |
