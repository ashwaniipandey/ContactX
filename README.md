# ContactHub - Full-Stack DSA Contact Management System

ContactHub is a full-stack contact management application transformed from a C++ terminal DSA program into a modern, high-performance web platform built with **Next.js 15**, **React 19**, and a custom **Vanilla CSS Glassmorphic Design System**.

Every Data Structure and Algorithm from the original C++ implementation has been preserved, enriched, and visualized with live Big-O metrics, comparison counting, and real-time disk persistence syncing to `contacts.txt`.

---

## 🚀 Key Features

- **Authentication & User Management**:
  - Secure Login, Registration, and **1-Click Instant Demo Login** via [`/api/auth`](file:///c:/Users/INFINIX/OneDrive/Desktop/ContactHub/src/app/api/auth/route.js).
  - User session persistence, custom avatar initials, and quick logout.
- **Dark & Light Mode Switcher**:
  - Seamless theme toggle with Sun ☀️ and Moon 🌙 icons.
  - Persistent preference stored in `localStorage` with calibrated slate/indigo color palettes for both modes.
- **Dynamic Vector Storage (`std::vector<Contact>`)**: Implemented via `ContactVector` dynamic array featuring contiguous memory indexing, dynamic capacity expansion (2x resize), and element shifting on deletion.
- **Search Algorithms**:
  - `searchByName`: Case-insensitive linear search with comparison tracking ($O(N)$).
  - `searchByPhone`: Instant phone number linear search ($O(N)$).
  - `searchByEmail`: Case-insensitive email query ($O(N)$).
  - Multi-field Search: Real-time debounced search scanning all fields simultaneously.
- **Comparator Sorting ($O(N \log N)$)**:
  - `sortByName`: Lexicographical sort (A → Z and Z → A).
  - `sortByPhone`: Phone number comparator sort.
  - `sortByDateAdded`: Chronological sort by date added (`DD-MM-YYYY`).
- **Validation & Constraint Rules**:
  - Phone validation: Exactly 10 numeric digits.
  - Duplicate prevention: Rejects duplicate phone numbers across the dataset.
  - Email format validation: Requires `@` and valid domain `.`.
- **Live Disk Persistence (`contacts.txt`)**:
  - Reads and writes the exact pipe-delimited format: `name|phone|email|address|favorite|dateAdded`.
  - Automatically syncs between the root workspace and `ContactHub/contacts.txt` so both the C++ terminal app and web app share identical data.
- **DSA Live HUD**:
  - Displays real-time algorithm execution metrics, Big-O time complexity, execution duration in milliseconds, and total comparisons made.
- **Interactive UI & Themes**:
  - Dual view modes: **Rich Card Grid** with dynamic gradient avatars and **Dense Table View**.
  - One-click **Favorite toggle (★)** with instant optimistic UI update.
  - Add & Edit contact modals with real-time field validation.
  - Delete contact modal honoring C++ prompt: `"Are you sure? (Y/N)"`.
  - In-browser `contacts.txt` raw file inspector, editor, live downloader, and file uploader.
  - Big-O Architecture inspector modal comparing C++ to full-stack implementation.

---

## 📊 Data Structures & Complexity Reference

| Operation | C++ Source Function | Full-Stack Equivalent | Time Complexity | Space Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Add Contact** | `ContactManager::addContact` | `POST /api/contacts` | $O(1)$ amortized ($O(N)$ duplicate check) | $O(1)$ |
| **View Contacts** | `ContactManager::viewContacts` | `GET /api/contacts` | $O(N)$ | $O(N)$ |
| **Search by Name** | `ContactManager::searchByName` | `GET /api/contacts?q=...&field=name` | $O(N)$ | $O(1)$ |
| **Search by Phone** | `ContactManager::searchByPhone` | `GET /api/contacts?q=...&field=phone` | $O(N)$ | $O(1)$ |
| **Search by Email** | `ContactManager::searchByEmail` | `GET /api/contacts?q=...&field=email` | $O(N)$ | $O(1)$ |
| **Sort by Name** | `ContactManager::sortByName` | `GET /api/contacts?sort=name` | $O(N \log N)$ | $O(\log N)$ |
| **Sort by Phone** | `ContactManager::sortByPhone` | `GET /api/contacts?sort=phone` | $O(N \log N)$ | $O(\log N)$ |
| **Delete Contact** | `ContactManager::deleteContact` | `DELETE /api/contacts?phone=...` | $O(N)$ search + $O(N)$ shift | $O(1)$ |
| **Favorites** | `ContactManager::viewFavoriteContacts` | `GET /api/contacts?favorites=true` | $O(N)$ predicate filter | $O(1)$ |
| **File Persistence** | `saveToFile()` / `loadFromFile()` | `/api/contacts/raw-file` | $O(N)$ serialization | $O(N)$ |

---

## 📁 Project Structure

```text
ContactHub/
├── package.json                 # Next.js & React dependencies
├── next.config.mjs              # Next.js configuration
├── jsconfig.json                # Path alias mapping (@/* -> src/*)
├── contacts.txt                 # Primary pipe-delimited data file
├── src/
│   ├── app/
│   │   ├── layout.js            # Root layout & Google Fonts
│   │   ├── globals.css          # Vanilla CSS Design System (Glassmorphism & DSA theme)
│   │   ├── page.js              # Main application single-page dashboard
│   │   └── api/
│   │       ├── contacts/
│   │       │   ├── route.js                 # GET, POST, PUT, DELETE contacts
│   │       │   ├── toggle-favorite/route.js # Toggle favorite star
│   │       │   ├── raw-file/route.js        # contacts.txt export & import
│   │       │   └── reset/route.js           # Seed demo contacts
│   │       └── statistics/route.js          # Live vector & contact statistics
│   ├── components/
│   │   ├── Header.js            # Brand, badges, and top actions
│   │   ├── StatsBar.js          # Live total, favorites, capacity metrics
│   │   ├── DsaHud.js            # Real-time Big-O and algorithm execution HUD
│   │   ├── Toolbar.js           # Search, field filters, sort dropdown, view toggle
│   │   ├── ContactCard.js       # Rich card with dynamic avatar and quick actions
│   │   ├── ContactTable.js      # Dense tabular contact view
│   │   ├── ContactModal.js      # Add/Edit form with C++ validation rules
│   │   ├── DeleteModal.js       # Confirmation dialog matching C++
│   │   ├── FileIoModal.js       # contacts.txt raw viewer, editor, and download
│   │   ├── DsaArchitectureModal.js # Big-O and architecture reference table
│   │   └── Toast.js             # Floating action notifications
│   └── lib/
│       └── dsa/
│           ├── Contact.js       # Contact model mirroring Contact.h/cpp
│           ├── ContactVector.js # Dynamic array mirroring std::vector<Contact>
│           └── ContactManager.js# Core DSA manager mirroring ContactManager.h/cpp
└── ContactHub/                  # Original C++ Terminal Application
    ├── Contact.h
    ├── Contact.cpp
    ├── ContactManager.h
    ├── ContactManager.cpp
    ├── main.cpp
    └── contacts.txt
```

---

## 🖥️ How to Run

### 1. Run the Full-Stack Web App
From the root directory:
```bash
# Install dependencies (already completed)
npm install

# Start development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Run the Original C++ Terminal App
```bash
cd ContactHub
g++ -std=c++11 main.cpp Contact.cpp ContactManager.cpp -o ContactHub.exe
./ContactHub.exe
```

---

## 💾 File Format Specification (`contacts.txt`)

Contacts are serialized using pipe-delimited records:
```text
name|phone|email|address|favorite|dateAdded
```

**Example:**
```text
vinay|1234567890|vinay@gmail.com|dhanas|1|11-07-2026
ash|1234567899|ash@gmail.com|varanasi|0|11-07-2026
Sarah Connor|9876543210|sarah@cyberdyne.org|Los Angeles|1|28-10-2026
```
Where `favorite` is `1` for Yes, and `0` for No.
