<div align="center">

# 🎫 Event Management System

**A full-stack event platform with role-based access — organizers publish events, admins curate them, and users register in one click.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white)](https://render.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📖 Overview

Planning an event is hard enough without a dozen spreadsheets, email threads, and DMs to keep track of who's coming. **Event Management System (EventPro)** replaces that chaos with a single, role-based platform:

- **Organizers** publish events and watch registrations roll in, complete with a participant list.
- **Admins** run a moderation queue — nothing goes live until it's approved.
- **Attendees** discover approved events, register in one click, and cancel anytime.

Every event has a hard capacity limit, duplicate sign-ups are impossible by design, and the whole flow is protected by JWT authentication and bcrypt password hashing. The API is documented with Swagger UI out of the box, and the app is deployed end-to-end — React on Vercel, FastAPI on Render, PostgreSQL in the cloud.

## 🔗 Live Demo

| Service | URL |
|---|---|
| 🌐 Frontend | [event-management-system-ruby-gamma.vercel.app](https://event-management-system-ruby-gamma.vercel.app) |
| 🔌 Backend API | [event-management-api-aw25.onrender.com](https://event-management-api-aw25.onrender.com) |
| 📚 Swagger Docs | [event-management-api-aw25.onrender.com/docs](https://event-management-api-aw25.onrender.com/docs) |

> These are the URLs wired into the codebase (CORS origins and the frontend API client). If you redeploy, update the CORS list in `backend/app/main.py` and `API_BASE_URL` in `frontend/src/utils/apiConfig.js`.

## ✨ Features

### 🔐 Authentication
- Email + password signup and login with **bcrypt** password hashing (salted, never stored in plain text)
- **JWT access tokens** (HS256, 30-minute expiry) returned on login and sent as `Bearer` tokens
- **Forgot password** flow: single-use, time-limited reset tokens emailed via **Resend**
- Reset tokens stored as **SHA-256 hashes** only — a DB leak exposes nothing usable
- Anti-enumeration: the API returns the same response whether or not an email exists, and equalizes timing with a dummy hash

### 👤 User Features
- Browse the catalog of **admin-approved** events
- Register for events in one click — with duplicate-registration and capacity enforcement
- Cancel a registration at any time
- Personal dashboard listing all registrations ("My Registrations")

### 🗂️ Organizer Features
- Create events with title, description, date, time, location, and capacity
- Manage a personal event dashboard — new events start as **Pending** awaiting admin approval
- Edit and delete only their own events
- View the participant list for their own events

### 🛡️ Admin Features
- Approve or reject pending events (the moderation queue)
- See every event in the system, regardless of status
- Edit/delete any event and view participants for any event

### 🔒 Security Features
- Role-based access control (`user` / `organizer` / `admin`) enforced server-side on every protected route
- Passwords hashed with bcrypt via Passlib
- JWT verification with `HTTPBearer` — Swagger's "Authorize" button works out of the box
- Restricted CORS allow-list (only the Vercel and local Vite origins)
- Frontend Axios interceptors attach tokens automatically and clear auth on `401`
- HTML-escaped email templates to prevent injection

### 🚀 Deployment Features
- **Vercel**: SPA with rewrite rules (`vercel.json`) so client-side routes survive hard refreshes
- **Render**: backend pinned to Python 3.12 (`runtime.txt`), zero-config `uvicorn` start
- **Environment-driven config** via `pydantic-settings` — one `.env` file switches local ↔ production

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | [React 19](https://react.dev) + [Vite 8](https://vite.dev) | Component UI with fast HMR builds |
| **Routing** | [React Router 7](https://reactrouter.com) | Client-side routing + role-guarded routes |
| **HTTP Client** | [Axios](https://axios-http.com) | API calls with JWT interceptors |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com) | Utility-first styling |
| **Backend** | [FastAPI 0.115](https://fastapi.tiangolo.com) | Async-ready REST API with auto-generated docs |
| **ORM** | [SQLAlchemy 2.0](https://www.sqlalchemy.org) | Typed models, relationships, and session management |
| **Auth** | [python-jose](https://github.com/mpdavis/python-jose) + [Passlib/bcrypt](https://passlib.readthedocs.io) | JWT issuance/verification, password hashing |
| **Validation** | [Pydantic v2](https://docs.pydantic.dev) | Request/response schemas with type safety |
| **Database** | [PostgreSQL](https://www.postgresql.org) (managed via Neon in production) | Relational storage with enum types and constraints |
| **Email** | [Resend](https://resend.com) | Transactional password-reset emails |
| **Deployment** | [Vercel](https://vercel.com) + [Render](https://render.com) | Frontend hosting, backend hosting |

## 🏗️ Architecture

```
+---------------------+
|       Browser       |
+----------+----------+
           |
           |  HTTPS
           v
+------------------------------+
|   React Frontend (Vercel)    |
|   React 19 · Vite · Router   |
|   Axios · Tailwind CSS       |
+----------+-------------------+
           |
           |  REST + JSON (JWT Bearer)
           v
+------------------------------+
|   FastAPI Backend (Render)   |
|   Routers → Services → ORM   |
+----------+-------------------+
           |                        \
           | SQLAlchemy ORM          | Resend API
           v                         v
+---------------------+   +------------------------+
|  PostgreSQL (Neon)  |   |  Resend Email Service  |
|  users · events ·   |   |  password-reset emails |
|  registrations      |   |                        |
+---------------------+   +------------------------+
```

The backend follows a clean **router → service → model** layering: API routes (`app/api/`) handle HTTP concerns and authorization, services (`app/services/`) contain all business rules (capacity checks, approval workflow, ownership checks), and models (`app/models/`) define the schema.

## 📁 Project Structure

```
event-management-system/
├── backend/                        # FastAPI application
│   ├── app/
│   │   ├── api/                    # Route handlers (routers)
│   │   │   ├── auth.py             #   Signup, login, password reset, /me
│   │   │   ├── events.py           #   Event CRUD, approval, registration actions
│   │   │   ├── registrations.py    #   "My registrations" endpoint
│   │   │   └── deps.py             #   get_current_user, require_role dependencies
│   │   ├── core/                   # App configuration & DB engine
│   │   │   ├── config.py           #   pydantic-settings environment config
│   │   │   └── database.py         #   SQLAlchemy engine, session, table creation
│   │   ├── models/                 # SQLAlchemy ORM models
│   │   │   ├── user.py             #   User + UserRole enum
│   │   │   ├── event.py            #   Event + EventStatus enum
│   │   │   └── registration.py     #   Registration (join table)
│   │   ├── schemas/                # Pydantic request/response models
│   │   │   ├── auth.py             #   UserCreate, TokenResponse, reset payloads
│   │   │   ├── event.py            #   EventCreate, EventResponse, ...
│   │   │   └── registration.py     #   RegistrationResponse, participants
│   │   ├── services/               # Business logic layer
│   │   │   ├── event_service.py    #   CRUD + approval workflow + role visibility
│   │   │   ├── registration_service.py  #   Capacity, duplicates, cancellation
│   │   │   └── email_service.py    #   Resend integration + dev fallback
│   │   ├── utils/                  # Security helpers
│   │   │   └── security.py         #   bcrypt, JWT, reset-token generation/hashing
│   │   └── main.py                 # App factory, CORS, router registration
│   ├── requirements.txt            # Python dependencies
│   ├── runtime.txt                 # Render: Python 3.12
│   ├── .env.example                # Environment template
│   ├── setup_db.py                 # Creates the PostgreSQL database
│   └── create_tables.py            # Creates tables + verifies schema
└── frontend/                       # React SPA
    ├── src/
    │   ├── pages/                  # Login, Signup, Forgot/Reset Password,
    │   │                           #   Dashboard, OrganizerDashboard,
    │   │                           #   AdminDashboard, Events, EventDetail,
    │   │                           #   MyRegistrations
    │   ├── components/             # AuthenticatedLayout, EventCard,
    │   │                           #   EventFormModal, ParticipantsModal, ...
    │   ├── context/AuthContext.jsx # Global auth state (token + user)
    │   ├── hooks/useAuth.js        # useAuth() hook for components
    │   ├── services/api.js         # Axios instance with JWT interceptors
    │   ├── utils/apiConfig.js      # API base URL + timeout config
    │   ├── App.jsx                 # Routes + role-based route guards
    │   └── main.jsx                # React entry point
    ├── package.json
    └── vercel.json                 # SPA rewrite rules for Vercel
```

## 🗄️ Database Design

Three tables form the core, connected by foreign keys and protected by a unique constraint.

```
users ──────┬──< events ──────< registrations >────── users
(id)        │   (id)              (id)               (id)
            │   organizer_id ─────┘  │                │
            │                        └── user_id ─────┘
```

### `users`
| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL (PK) | Indexed |
| `full_name` | VARCHAR(100) | Required |
| `email` | VARCHAR(255) | **Unique**, indexed |
| `password` | VARCHAR(255) | bcrypt hash — never plain text |
| `role` | ENUM `user_role` | `user` (default) \| `organizer` \| `admin` |
| `reset_token` | VARCHAR(64) | SHA-256 hash of reset token |
| `reset_token_expiry` | TIMESTAMPTZ | UTC expiry for reset tokens |
| `created_at` | TIMESTAMPTZ | Auto-set on insert |

### `events`
| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL (PK) | Indexed |
| `title` | VARCHAR(200) | Required |
| `description` | TEXT | Required |
| `date` | DATE | Event date |
| `time` | TIME | Event start time |
| `location` | VARCHAR(255) | Venue/location |
| `capacity` | INTEGER | Max attendees (`> 0`) |
| `status` | ENUM `event_status` | `pending` (default) \| `approved` \| `rejected` |
| `organizer_id` | FK → `users.id` | `ON DELETE CASCADE`, indexed |
| `created_at` | TIMESTAMPTZ | Auto-set on insert |

### `registrations`
| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL (PK) | Indexed |
| `user_id` | FK → `users.id` | `ON DELETE CASCADE`, indexed |
| `event_id` | FK → `events.id` | `ON DELETE CASCADE`, indexed |
| `registered_at` | TIMESTAMPTZ | Auto-set on insert |

**Key relationships & constraints:**
- A **user** (as organizer) has many **events**; an event belongs to one organizer.
- A **user** has many **registrations**; an **event** has many registrations.
- `UNIQUE (user_id, event_id)` guarantees **one registration per user per event** — enforced at the database level, not just in app code.
- **Event status lifecycle:** `pending → approved` (or `rejected`) by an admin. Editing an approved event resets it to `pending` so changes are re-reviewed.

## 🔑 Authentication Flow

```
┌────────┐   ┌──────────┐   ┌────────────┐   ┌──────────┐   ┌────────────┐
│ Signup │ → │  Login   │ → │  JWT Token │ → │ Protected│ → │ Forgot/    │
│        │   │          │   │ (HS256,    │   │  Routes  │   │ Reset PW   │
│        │   │          │   │  30 min)   │   │          │   │ (email)    │
└────────┘   └──────────┘   └────────────┘   └──────────┘   └────────────┘
```

1. **Signup** — `POST /api/auth/signup` validates the payload (name 2–100 chars, valid email, password ≥ 6 chars, optional role), rejects duplicate emails, and stores a bcrypt hash.
2. **Login** — `POST /api/auth/login` verifies credentials against the hash and returns `{ access_token, token_type, user }`.
3. **JWT Token** — The token encodes `sub` (user ID) and `role`, signed with HS256 using `SECRET_KEY`, expiring after `ACCESS_TOKEN_EXPIRE_MINUTES` (30).
4. **Protected Routes** — The frontend stores the token and attaches it via an Axios interceptor (`Authorization: Bearer <token>`). The backend's `get_current_user` dependency decodes it, loads the user, and `require_role(...)` further gates routes by role. A `401` response clears local auth and redirects to `/login`.
5. **Forgot Password** — `POST /api/auth/forgot-password` generates a cryptographically secure token (`secrets.token_urlsafe(32)`), stores **only its SHA-256 hash** with a 15-minute expiry, and emails a reset link via Resend. The response is identical whether or not the account exists (anti-enumeration).
6. **Reset Password** — `POST /api/auth/reset-password` hashes the submitted token, looks it up, rejects expired/used tokens with a generic message, sets the new bcrypt hash, and invalidates the token (single-use).

## 👥 User Roles

| Role | Can do | Redirected to |
|---|---|---|
| **User** | Browse approved events, register/cancel registrations, view "My Registrations" | `/user/dashboard` |
| **Organizer** | Create/edit/delete own events, view own events' participants | `/organizer/dashboard` |
| **Admin** | Approve/reject events, view/manage all events, view any event's participants | `/admin/dashboard` |

Role membership is assigned at signup (defaults to `user`) and is enforced twice: **client-side** (protected routes with `allowedRoles` redirect unauthorized users to their own dashboard) and **server-side** (the `require_role` dependency returns `403` with the required-vs-actual role message).

## 📡 API Endpoints

Base URL: `https://event-management-api-aw25.onrender.com` · Interactive docs at `/docs`

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/signup` | Register a new user (name, email, password, role) | Public |
| `POST` | `/login` | Authenticate and receive a JWT access token | Public |
| `POST` | `/forgot-password` | Email a single-use password reset link | Public |
| `POST` | `/reset-password` | Set a new password with a valid reset token | Public |
| `GET` | `/me` | Get the authenticated user's profile | 🔒 Any logged-in user |

### Events (`/api/events`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/` | Create an event (starts as `pending`) | 🔒 Organizer |
| `GET` | `/` | List events — role-based visibility (users: approved, organizers: own, admins: all). Supports `skip`/`limit` | 🔒 Any logged-in user |
| `GET` | `/{event_id}` | Get full event details with organizer info | 🔒 Any logged-in user |
| `PUT` | `/{event_id}` | Update an event (own only for organizers; any for admins; approved → resets to pending) | 🔒 Organizer, Admin |
| `DELETE` | `/{event_id}` | Delete an event | 🔒 Organizer, Admin |
| `POST` | `/{event_id}/register` | Register for an event (capacity + duplicate checks) | 🔒 User |
| `DELETE` | `/{event_id}/register` | Cancel your registration | 🔒 User |
| `GET` | `/{event_id}/participants` | List registered participants | 🔒 Organizer (own), Admin |

### Registrations (`/api/registrations`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/my` | All events the current user registered for (with event details) | 🔒 Any logged-in user |

### Admin (`/api/events`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `PATCH` | `/{event_id}/approve` | Approve a pending event (`pending → approved`) | 🔒 Admin |
| `PATCH` | `/{event_id}/reject` | Reject a pending event (`pending → rejected`) | 🔒 Admin |

Plus health endpoints: `GET /` (service info + docs link) and `GET /health` (readiness probe).

## 🚀 Installation

### Prerequisites
- [Python 3.12](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/) (npm included)
- [PostgreSQL](https://www.postgresql.org/download/) 14+ running locally

### 1. Clone the repository

```bash
git clone https://github.com/AaryanThota26/Event-Management-System.git
cd Event-Management-System
```

### 2. Backend setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
# Windows (git-bash / cmd):
source venv/Scripts/activate
# macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your database credentials and Resend API key
```

> ⚠️ Only the keys listed in `.env.example` are accepted — `pydantic-settings` is configured to reject unknown environment variables at startup.

### 4. Initialize the database

```bash
python setup_db.py        # Creates the 'event_management' database (idempotent)
python create_tables.py   # Creates users/events/registrations tables + verifies schema
```

### 5. Run the backend

```bash
uvicorn app.main:app --reload
```

The API is now at `http://localhost:8000` — Swagger UI at `http://localhost:8000/docs`.

### 6. Frontend setup

```bash
cd ../frontend

# Install packages
npm install

# Run the Vite dev server
npm run dev
```

The app opens at `http://localhost:5173` (this origin is already in the backend CORS allow-list).

> **Local development note:** `frontend/src/utils/apiConfig.js` points to the deployed Render backend. For fully local development, change `API_BASE_URL` to `http://localhost:8000`. When `RESEND_API_KEY` is empty, the backend logs reset links to the console instead of sending emails (dev fallback).

## 🔧 Environment Variables

All variables live in `backend/.env` (template: `backend/.env.example`). Placeholder values shown.

| Variable | Description | Example |
|---|---|---|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `your_actual_password_here` |
| `DB_NAME` | Database name | `event_management` |
| `SECRET_KEY` | JWT signing key — use a long random string in production | `change-me-in-production` |
| `ALGORITHM` | JWT signing algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifetime | `30` |
| `DEBUG` | SQL echo + verbose logging | `True` |
| `RESEND_API_KEY` | Resend API key for reset emails | `re_xxxxxxxxxxxxxxxx` |
| `RESEND_FROM_EMAIL` | Sender address | `EventPro <onboarding@resend.dev>` |
| `FRONTEND_URL` | Frontend origin used in reset links | `http://localhost:5173` |
| `RESET_TOKEN_EXPIRE_MINUTES` | Reset token lifetime | `15` |

## 📸 Screenshots

> Screenshots live in `docs/screenshots/`. Drop a PNG in that folder and reference it here.

| Screen | Screenshot |
|---|---|
| Home | `<!-- docs/screenshots/home.png -->` |
| Login | `<!-- docs/screenshots/login.png -->` |
| Signup | `<!-- docs/screenshots/signup.png -->` |
| User Dashboard | `<!-- docs/screenshots/dashboard.png -->` |
| Organizer Dashboard | `<!-- docs/screenshots/organizer-dashboard.png -->` |
| Admin Dashboard | `<!-- docs/screenshots/admin-dashboard.png -->` |
| Events | `<!-- docs/screenshots/events.png -->` |
| Event Details | `<!-- docs/screenshots/event-details.png -->` |

## 🚧 Future Improvements

- **QR code check-in** — generate a QR code per registration for fast on-site scanning
- **Event images** — cover photos per event (S3/Cloudinary upload + storage)
- **Search & filters** — full-text search by title/location, filter by date and category
- **Calendar view** — iCalendar export and a month/week calendar of registered events
- **Analytics dashboard** — attendance trends, capacity utilization, popular categories
- **Push notifications** — reminders for upcoming events via email/SMS/Web Push

## 📄 License

Distributed under the **MIT License**. See the [`LICENSE`](LICENSE) file for details.

## 👤 Author

**Aaryan Thota** — [@AaryanThota26](https://github.com/AaryanThota26)

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository and create a feature branch (`git checkout -b feature/amazing-feature`)
2. **Commit** your changes (`git commit -m 'Add amazing feature'`)
3. **Push** to the branch (`git push origin feature/amazing-feature`)
4. **Open a Pull Request** — describe what you changed and why

Please keep changes focused, run the existing verification scripts (`backend/test_auth.py`, `backend/validate_models.py`) before submitting, and follow the existing code style. For major changes, open an issue first to discuss.

## 🙏 Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com) and [SQLAlchemy](https://www.sqlalchemy.org) for a backend that documents itself
- [React](https://react.dev), [Vite](https://vite.dev), and [Tailwind CSS](https://tailwindcss.com) for the frontend experience
- [Neon](https://neon.tech) for managed PostgreSQL, [Resend](https://resend.com) for transactional email
- [Vercel](https://vercel.com) and [Render](https://render.com) for free-tier hosting that made the live demo possible

---

<div align="center">

**Built with ❤️ using FastAPI, React, and PostgreSQL**

</div>
