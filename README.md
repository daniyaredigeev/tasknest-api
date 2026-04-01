# 🚀 TaskNest — Full-Stack Kanban Management System

**TaskNest** is a professional task management application built with **NestJS** and **Next.js 14**. It features a robust role-based access control system (RBAC), secure JWT authentication via HttpOnly cookies, and a dynamic Kanban interface.

---

## 🏗 Project Architecture

The project is split into two main autonomous directories:

* **Backend (`/backend`)** — RESTful API built with NestJS, Prisma ORM, and PostgreSQL
* **Frontend (`/frontend`)** — Modern UI built with Next.js (App Router), Tailwind CSS, and Lucide Icons

---

## 🛠 Tech Stack

### 🔙 Backend (NestJS)

* **Framework:** NestJS (Node.js)
* **Database:** PostgreSQL + Prisma ORM
* **Authentication:** JWT (Access & Refresh Tokens) + Passport.js
* **Security:** Argon2 password hashing, HttpOnly Cookies, CORS with credentials
* **Validation:** class-validator & class-transformer

### 🔜 Frontend (Next.js 14)

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS (responsive design)
* **Icons:** Lucide React
* **State Management:** React Hooks (useState, useEffect)
* **Security:** Middleware for route protection & automatic JWT refresh

---

## 🔑 Role-Based Access Control (RBAC)

| Feature              | USER | ADMIN |
| -------------------- | :--: | :---: |
| View Boards          |   ✅  |   ✅   |
| Create/Delete Boards |   ❌  |   ✅   |
| Manage Own Tasks     |   ✅  |   ✅   |
| Change Task Status   |   ✅  |   ✅   |
| View Task Owner ID   |   ❌  |   ✅   |
| User Management      |   ❌  |   ✅   |

---

## 📡 API Endpoints

### 🔐 Authentication (`/auth`)

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| POST   | `/auth/register` | Register a new account   |
| POST   | `/auth/login`    | Login and receive JWT    |
| POST   | `/auth/refresh`  | Refresh access token     |
| POST   | `/auth/logout`   | Logout (clear cookies)   |
| GET    | `/auth/me`       | Get current user profile |

---

### 📋 Boards & Tasks (`/boards`, `/tasks`)

| Method | Endpoint         | Description       | Access |
| ------ | ---------------- | ----------------- | ------ |
| GET    | `/boards`        | Get all boards    | JWT    |
| GET    | `/boards/:id`    | Get board details | JWT    |
| POST   | `/boards/create` | Create board      | ADMIN  |
| PATCH  | `/boards/:id`    | Update board      | ADMIN  |
| DELETE | `/boards/:id`    | Delete board      | ADMIN  |
| GET    | `/tasks`         | Get all tasks     | JWT    |
| GET    | `/tasks/:id`     | Get task          | JWT    |
| POST   | `/tasks/create`  | Create task       | JWT    |
| PATCH  | `/tasks/:id`     | Update task       | JWT    |
| DELETE | `/tasks/:id`     | Delete task       | JWT    |

---

### 👤 User Management (`/users`)

| Method | Endpoint     | Description   | Access |
| ------ | ------------ | ------------- | ------ |
| GET    | `/users`     | Get all users | ADMIN  |
| POST   | `/users`     | Create user   | ADMIN  |
| GET    | `/users/:id` | Get user      | ADMIN  |
| DELETE | `/users/:id` | Delete user   | ADMIN  |

---

## 📸 Interface Preview

### 🖥️ Main & Authentication

| Home Page                                            | Login Form                                             |
| ---------------------------------------------------- | ------------------------------------------------------ |
| ![Main](./screenshots/Снимок%20экрана%20\(994\).png) | ![Login](./screenshots/Снимок%20экрана%20\(1002\).png) |

---

### 📋 Boards

| Boards                                                  | Admin View                                             |
| ------------------------------------------------------- | ------------------------------------------------------ |
| ![Boards](./screenshots/Снимок%20экрана%20\(1004\).png) | ![Admin](./screenshots/Снимок%20экрана%20\(1007\).png) |

---

### 🛠 Tasks

| Tasks                                                  | Create Board                                            |
| ------------------------------------------------------ | ------------------------------------------------------- |
| ![Tasks](./screenshots/Снимок%20экрана%20\(1005\).png) | ![Create](./screenshots/Снимок%20экрана%20\(1006\).png) |

---

## ⚙️ Installation & Setup

### 1️⃣ Backend

```bash
cd backend
npm install

# Create .env with:
# DATABASE_URL=
# JWT_SECRET=
# COOKIE_DOMAIN=

npx prisma migrate dev
npm run start:dev
```

---

### 2️⃣ Frontend

```bash
cd ../frontend
npm install

# Create .env.local with:
# NEXT_PUBLIC_API_URL=

npm run dev
```

---

## 💡 Key Features

* **Smart Filtering**
  Users can only see and manage their own tasks on shared boards

* **Cascade Deletion**
  Deleting a board removes all related tasks automatically (Prisma relations)

* **Silent Token Refresh**
  Automatic session renewal on 401 errors

* **Middleware Protection**
  Unauthorized users are redirected to login

---

## 👤 Author

**Daniyar Yedigeyev**
Software Engineering Student (2026)
