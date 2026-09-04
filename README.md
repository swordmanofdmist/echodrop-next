# EchoDrop

EchoDrop is a simple anonymous city message board rebuilt with Next.js and MongoDB.

Users can register, log in immediately, post, comment, like posts, and view their own posts. There is no email verification flow.

## Features

- Register and log in with hashed passwords
- Cookie-based JWT authentication
- MongoDB persistence with Mongoose
- Anonymous city posts that expire after 24 hours
- Comments, likes, delete-own-post, and profile/my-posts pages

## Setup

Create `.env` from `.env.example`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/echodrop
JWT_SECRET=replace-this-with-a-long-random-secret
```

Install dependencies and run the app:

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Pages

- `/` login
- `/register` registration
- `/home` active feed and post composer
- `/post/[id]` post details and comments
- `/profile` current user and their posts
- `/about` short app info
