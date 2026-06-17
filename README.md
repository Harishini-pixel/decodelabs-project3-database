# 🗄️ Student Task Manager Database System

A complete backend application with SQLite database integration developed using Node.js and Express.js.

## 📖 Project Overview

This project extends the Student Task Manager API by integrating a relational database for persistent data storage.

The application automatically creates the database and tables, allowing users to perform complete CRUD operations while maintaining data integrity.

---

## 🚀 Features

### ✅ Database Integration

* SQLite Database
* Automatic Database Creation
* Automatic Table Creation
* Persistent Data Storage

---

### ✅ CRUD Operations

#### 📥 Create

Add new tasks.

#### 📤 Read

Retrieve all tasks.

#### ✏️ Update

Modify existing tasks.

#### ❌ Delete

Remove tasks.

---

### ✅ Relational Data Management

Database Table:

```sql
tasks
```

Fields:

* id
* title
* description
* status
* created_at

---

### ✅ Secure Database Queries

* Parameterized Queries
* SQL Injection Protection
* Input Validation

---

## 🛠️ Technologies Used

* Node.js
* Express.js
* SQLite3
* JavaScript

---

## 📂 Project Structure

```text
├── package.json
├── package-lock.json
├── server.js
├── tasks.db
└── README.md
```

---

## 🧪 Supported API Endpoints

| Method | Endpoint       |
| ------ | -------------- |
| GET    | /api/tasks     |
| POST   | /api/tasks     |
| PUT    | /api/tasks/:id |
| DELETE | /api/tasks/:id |

---

## 🎯 Learning Outcomes

Through this project, I learned:

* Database Design
* SQLite Integration
* CRUD Operations
* Backend Development
* Data Persistence
* API Development
* SQL Fundamentals

---

## 🔮 Future Improvements

* PostgreSQL Integration
* User Authentication
* Cloud Database Support
* Task Categorization
* Analytics Dashboard

---

## 👩‍💻 Author

Harishini K

B.Tech Electronics and Communication Engineering

Manakula Vinayagar Institute of Technology

---

⭐ Developed as part of the DecodeLabs Full Stack Development Internship Program.

🚀 Project completed successfully with full database integration and RESTful API support.
