# EchoDrop

EchoDrop is a simple anonymous city message board rebuilt with Next.js and MongoDB.

Users can register, log in immediately, reset forgotten passwords directly, post, comment, like posts, and view their own posts. There is no email verification flow.

## Features

- Register and log in with hashed passwords
- Cookie-based JWT authentication
- Direct password reset form for local/demo use
- MongoDB persistence with Mongoose
- Anonymous city posts that expire after 24 hours
- Comments, likes, delete-own-post, and profile/my-posts pages

## Setup

Create `.env.local` from `.env.example` (keep it out of git):

```env
MONGODB_URI=mongodb://127.0.0.1:27017/echodrop
JWT_SECRET=replace-this-with-a-long-random-secret
```

The direct reset form identifies an account by email and changes its password without email verification. This keeps local demonstrations simple, but a production application should use a verified, expiring reset link instead.

Use a running local MongoDB server, or set `MONGODB_URI` to your MongoDB Atlas connection string. The connection helper explicitly selects the dedicated `echodrop` database with Mongoose's `dbName` option, overriding any database name in the URI. For Atlas, configure a database user and allow your machine's IP address in Network Access. Keep the URI and JWT secret server-side.

Install dependencies and run the app:

```powershell
npm install
npm run db:check
npm run dev
```

Open `http://localhost:3000`.

`db:check` pings the configured database without changing its contents or printing credentials.

## Implementation

- Shared authentication form, navigation, and post component.
- One small request helper for JSON, errors, and `cache: "no-store"`.
- Dynamic pages and GET API routes; API responses use `Cache-Control: no-store`.
- Direct Mongoose connection with a five-second connection timeout, without a custom global connection or promise cache. Mongoose still manages its normal connection pool and model registry.
- Feed and profile use the same MongoDB post query helper. No post or comment results are cached.

Run `npm run lint` and `npm run build` to check the project.

The city photograph in `public/city.jpg` is from [Unsplash](https://images.unsplash.com/photo-1477959858617-67f85cf4f1df), downloaded locally so the interface does not depend on an external image request.

## Pages

For a walkthrough of every page, the code structure, and a presentation script, see the [Project & Presentation Guide (PDF)](docs/EchoDrop-Presentation-Guide.pdf) or the [browser version](docs/EchoDrop-Presentation-Guide.html).

- `/` login
- `/register` registration
- `/forgot-password` choose a new password using the account email
- `/home` active feed and post composer
- `/post/[id]` post details and comments
- `/profile` current user and their posts
- `/about` short app info
