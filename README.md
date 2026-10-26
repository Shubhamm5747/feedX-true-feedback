# FeedX — True Feedback

An anonymous messaging platform where users can share a personal link to receive honest, anonymous feedback and questions from friends, colleagues, or followers.

Built with Next.js (App Router), TypeScript, Tailwind CSS, MongoDB, and NextAuth.

---

## Features

- **Public Profile Link**: Every registered user gets a public link (`/u/[username]`) where anyone can submit anonymous messages.
- **Message Dashboard**: Protected dashboard to view, refresh, and delete received messages.
- **Accept Messages Toggle**: Easily switch on/off the ability to receive new messages.
- **Suggested Questions**: Message suggestions generated to help senders break the ice.
- **Email Verification**: User registration requires OTP verification sent via Resend and React Email.
- **Username Availability Check**: Real-time debounced checks to verify if a username is available during signup.
- **Form Validation**: Type-safe client and server-side validation using Zod and React Hook Form.
- **Theme Toggle**: Light and dark mode support using `next-themes`.

---

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript
- **Database**: MongoDB via [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Credentials Provider)
- **Styling**: Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com/), Radix UI
- **Email**: [Resend](https://resend.com/) + React Email
- **Validation**: Zod + React Hook Form
- **Icons & UI Utilities**: Lucide React, Sonner (toasts)

---

## Getting Started

### Prerequisites

Ensure you have the following installed / set up:
- **Node.js** (v18.18 or higher recommended)
- **npm**, **pnpm**, or **yarn**
- A **MongoDB** database instance (local or MongoDB Atlas)
- A **Resend** account for sending verification emails

### 1. Clone the repository

```bash
git clone https://github.com/your-username/feedX-true-feedback.git
cd feedX-true-feedback
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory (or copy `.env.example`):

```bash
cp .env.example .env
```

Add your credentials:

```env
MONGODB_URI=your_mongodb_connection_uri
NEXTAUTH_SECRET=your_nextauth_secret_key
RESEND_API_KEY=your_resend_api_key
OPENAI_API_KEY=your_openai_api_key   # Optional
```

> **Tip**: You can generate a random `NEXTAUTH_SECRET` by running:
> ```bash
> openssl rand -base64 32
> ```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```text
├── emails/                  # React Email templates (verification email)
├── public/                  # Static assets and icons
├── src/
│   ├── app/
│   │   ├── (app)/           # Authenticated application pages (dashboard, home)
│   │   ├── (auth)/          # Auth flows (sign-in, sign-up, verify)
│   │   ├── api/             # Next.js route handlers (auth, messages, suggestions)
│   │   └── u/[username]/    # Public anonymous message submission page
│   ├── components/          # Reusable UI and layout components
│   │   └── ui/              # shadcn/ui primitive components
│   ├── context/             # Auth provider and state wrappers
│   ├── helpers/             # Email dispatch and helper utilities
│   ├── lib/                 # Database connection, Resend client, utils
│   ├── model/               # Mongoose User and Message schemas
│   ├── schemas/             # Zod validation schemas
│   └── types/               # TypeScript interfaces and NextAuth extensions
└── package.json
```

---

## Available Scripts

- `npm run dev` — Starts the development server with Turbopack
- `npm run build` — Builds the application for production
- `npm run start` — Starts the production server
- `npm run lint` — Runs ESLint checks
