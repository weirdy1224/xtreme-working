
# 🚀 CodeFlow Platform

A full-stack coding platform to submit and run code, track progress, and compete on a global leaderboard—built with **MERN stack**, **Prisma ORM**, and **Sphere Engine** integration.

---

## 🌟 Features

- 🔐 User registration & authentication  
- 📝 Problem submission with multiple languages  
- ⚡ Real-time code execution (Sphere Engine)  
- ✔️ Automated testcase evaluation & result tracking  
- 🎯 Leaderboard: track problems solved  
- 🛠️ Admin dashboard: manage users & problems  

---

## 🛠 Tech Stack

| Layer      | Technology                                     |
|:-----------|:----------------------------------------------|
| Backend    | Node.js, Express.js, Prisma, PostgreSQL        |
| Frontend   | React, Zustand (state management), Axios       |
| Other      | Sphere Engine API, Docker (backend deployment) |

---

## 🚧 Setup Instructions

### Backend

```
# 1. Go to the backend folder
cd codeflow-backend

# 2. Install dependencies (first time only)
npm i

# 3. Set up the database with Prisma
npx prisma migrate dev
npx prisma generate

# 4. Start the development server
npm run dev

# 5. (In a new terminal) Start Docker services
docker-compose up -d
```

---

### Folder Structure

```
/codeflow-backend
 ├─ /libs           # Helper libraries
 ├─ /generated      # Prisma generated client
 ├─ /routes         # API routes
 ├─ /controllers    # Controller logic
 ├─ /utils          # Utility functions
 └─ server.js       # Express server entry

/codeflow-frontend
 ├─ /src
 │   ├─ /components  # React components
 │   ├─ /store       # Zustand store
 │   └─ App.jsx      # Main app
 └─ package.json
```

---

### 🌱 Environment Variables

Create a `.env` file in your backend root using this template:

```
PORT=4000
NODE_ENV=development
DATABASE_URL=
CORS_ORIGIN=http://localhost:3000
CLIENT_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
TEMP_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
SPHERE_ENGINE_ENDPOINT=
SPHERE_ENGINE_TOKEN=
```

---

## 📄 License

CodeFlow Platform is released under the MIT License.

