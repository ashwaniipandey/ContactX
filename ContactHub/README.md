# ContactHub - C++ Terminal Project & Full-Stack Web App

This directory contains the original C++ DSA implementation of ContactHub.
A complete full-stack Next.js web application is located in the parent directory.

## C++ Files
- `Contact.h` / `Contact.cpp`: Contact class definition and member functions.
- `ContactManager.h` / `ContactManager.cpp`: Vector management, linear search, comparator sorting, file I/O.
- `main.cpp`: Interactive CLI menu loop.
- `contacts.txt`: Pipe-delimited contact storage (`name|phone|email|address|favorite|dateAdded`).

## How to Compile & Run C++
```bash
g++ -std=c++11 main.cpp Contact.cpp ContactManager.cpp -o ContactHub.exe
./ContactHub.exe
```

## How to Run Full-Stack Web App
In the parent directory (`..`):
```bash
npm run dev
```
Then open `http://localhost:3000` in your web browser.
