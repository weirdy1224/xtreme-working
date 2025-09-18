<h1 align="center" id="title">CodeFlow Backend</h1>

<p id="description">Backend for **CodeFlow**, a LeetCode-style coding platform. Built with Node.js Express PostgreSQL and Prisma ORM. Supports user auth (JWT) personalized problem/sheets problem management and real-time code execution via the Judge0 API.</p>

<p align="center"><img src="https://socialify.git.ci/Maverick341/leetlab-backend/image?custom_language=Express&amp;font=Bitter&amp;language=1&amp;name=1&amp;owner=1&amp;theme=Light" alt="project-image"></p>

  
<h2>🧐 Features</h2>

Here're some of the project's best features:

*   🧠 User authentication (JWT)
*   📝 CRUD APIs for problems
*   🧪 Code submission with result handling
*   📊 Submission and progress tracking
*   🔒 Secure routes with middleware

<h2>🛠️ Installation Steps:</h2>

<p>1. Clone the repo</p>

```
git clone https://github.com/Maverick341/codeflow-backend.git cd leetlab/backend
```

<p>2. Install dependencies</p>

```
npm install
```

<p>3. Set environment variables</p>

```
cp .env.example .env
```

<p>4. Run database migrations</p>

```
npx prisma migrate dev
```

<p>5. Start the server</p>

```
npm run dev
```

<h2>🍰 Contribution Guidelines:</h2>

Contributions are welcome — simply fork the repo create a new branch push your changes and open a pull request.

  
  
<h2>💻 Built with</h2>

Technologies used in the project:

*   Node.js
*   Express.js
*   PostgreSQL
*   Prisma ORM
*   Judge0 API
*   JWT
*   bcryptjs

<h2>🛡️ License:</h2>

This project is licensed under the MIT License
