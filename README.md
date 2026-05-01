# CodeShare — Frontend

React + Vite frontend for the AI-powered code sharing platform.

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:3000
```

The Vite dev server proxies all `/api` requests to `http://localhost:5000` automatically — no CORS issues in development.

## Project Structure

```
src/
├── api/
│   └── index.js          # All fetch calls to backend
├── context/
│   └── AuthContext.jsx   # Global auth state (user, login, logout)
├── components/
│   ├── Navbar.jsx        # Sticky navbar + mobile hamburger
│   ├── PostCard.jsx      # Feed post card (expandable comments)
│   ├── AIBox.jsx         # Highlighted AI suggestion box
│   ├── CommentThread.jsx # Nested user comments
│   └── Spinner.jsx       # Loading spinner
├── pages/
│   ├── Feed.jsx          # Home feed (paginated)
│   ├── Login.jsx         # Login form
│   ├── Register.jsx      # Registration form
│   ├── CreatePost.jsx    # New post form with code editor
│   ├── PostDetail.jsx    # Full post + all comments
│   └── Profile.jsx       # User profile + their posts
├── styles/
│   ├── global.css        # Design tokens, reset, animations
│   ├── components.css    # Navbar, PostCard, AIBox, Comments
│   └── pages.css         # Auth, Feed, CreatePost, Detail, Profile
└── App.jsx               # Router + protected routes
```

## Pages

| Route          | Page          | Auth required |
|----------------|---------------|---------------|
| `/`            | Feed          | No            |
| `/login`       | Login         | No            |
| `/register`    | Register      | No            |
| `/posts/:id`   | Post Detail   | No            |
| `/create`      | Create Post   | ✅ Yes        |
| `/profile/:id` | User Profile  | ✅ Yes        |

## Key UX Features

- **AI comment** appears highlighted with violet border + glow animation at the top of each comment thread
- **Inline comments** expand inside the feed card without navigating away
- **Optimistic UI** for likes and comment count
- **Loading skeletons** on feed page
- **AI pending state** shows pulsing dot while AI is generating
- **Copy button** on every code block
- **Mobile-first** responsive layout with hamburger menu
- **Protected routes** redirect to `/login` with return navigation
