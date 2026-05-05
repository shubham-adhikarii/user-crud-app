# User CRUD App — Next.js

A simple User CRUD application built with Next.js (App Router), TypeScript, and Axios.

## Tech Stack

- **Next.js 14** — App Router
- **React 18**
- **TypeScript**
- **Axios** with request & response interceptors

## API

Uses [JSONPlaceholder](https://jsonplaceholder.typicode.com):

- `GET /users` — fetch all users
- `GET /users/:id` — fetch single user
- `PUT /users/:id` — update user
- `DELETE /users/:id` — delete user

> Note: JSONPlaceholder does not persist data. Changes are reflected in local state only.

## Pages

| Route | Description |
|---|---|
| `/users` | List all users with name, email, and a View button |
| `/users/[id]` | View, update, and delete a single user |

## Features

- **Fetch All Users** — Displays name and email, each with a View button
- **Fetch Single User** — Loads user detail by ID
- **Update User** — Form pre-filled with existing data; calls `PUT /users/:id`; optimistic update (local state updates immediately before API response)
- **Delete User** — Calls `DELETE /users/:id`; optimistically redirects back to `/users` immediately
- **Axios Interceptor** — Logs all outgoing requests and incoming responses (see `src/lib/axiosClient.ts`)

## Optimistic Mutations

Both update and delete are **optimistic**:

- **Update**: Local state is updated immediately. If the API call fails, state is reverted to the previous value.
- **Delete**: User is redirected to `/users` immediately before the API call completes.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it will redirect to `/users` automatically.

## Deployment

Deploy on Vercel:

```bash
npx vercel
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Redirects to /users
│   ├── globals.css         # Global styles
│   └── users/
│       ├── page.tsx        # /users — list all users
│       └── [id]/
│           └── page.tsx    # /users/[id] — view, update, delete
└── lib/
    ├── axiosClient.ts      # Axios instance with interceptors
    └── types.ts            # TypeScript interfaces
```
