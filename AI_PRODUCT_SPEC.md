# AI_PRODUCT_SPEC.md
## Full-stack Product Specification for F-IELTS (Next.js + Supabase)

---

# 1. PROJECT OVERVIEW

You are building a full-stack responsive web application for an online IELTS self-study platform named **F-IELTS**.

F-IELTS is a modern EdTech SaaS product that helps users prepare for the IELTS exam independently, focusing on all four skills:
- Reading
- Listening
- Writing
- Speaking

The platform supports:
- Free practice
- Full mock tests
- Learning analytics
- AI-assisted Writing & Speaking feedback (future extension)

Target users:
- University students
- Working professionals
- IELTS self-learners
- Vietnamese users (bilingual Vietnamese / English)

---

# 2. TECH STACK (MANDATORY)

## Frontend & Backend
- Framework: **Next.js (App Router)**
- Language: **TypeScript**
- Styling: **TailwindCSS**
- Rendering: Server Components by default

## Backend (inside Next.js)
- API Routes & Server Actions
- Authentication: **Supabase Auth**
- Database: **Supabase PostgreSQL**
- Storage: **Supabase Storage**

## Deployment
- Frontend & Backend: Vercel
- Database & Auth: Supabase Cloud

---

# 3. UI SOURCE & CONSTRAINTS

- UI HTML files are already available in: html-ui-page/
- Each HTML file represents one full page/screen.
- These HTML files must be:
- Converted into React components
- Styled with TailwindCSS
- Fully responsive (mobile / tablet / desktop)

Rules:
- DO NOT redesign UI
- DO NOT change UX flow
- Only refactor HTML → React + Tailwind
- Preserve visual hierarchy and layout

---

# 4. RESPONSIVE DESIGN REQUIREMENTS (CRITICAL)

The entire application must be fully responsive.

## Desktop
- Max-width container
- Multi-column layouts allowed
- Sidebar layouts supported

## Tablet
- Reduced padding
- Stack columns vertically
- Collapse sidebars into toggles

## Mobile
- Single-column layout
- Touch-friendly buttons
- Sticky bottom CTA if applicable
- Hide secondary content behind expandable sections

Mobile-first approach is REQUIRED.

---

# 5. BRAND IDENTITY

- Brand name: **F-IELTS**
- Primary color: Red
- Background: White
- Text: Neutral gray
- CTA buttons: Red background, white text
- Corners: Rounded (rounded-lg)
- Shadows: Soft

Tone:
- Professional
- Motivating
- Academic but approachable

---

# 6. APPLICATION STRUCTURE

## Expected Folder Structure


.
├── .next/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                 # Landing / Home
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   │
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   ├── practice/
│   │   ├── page.tsx             # Skill selection
│   │   ├── reading/
│   │   │   └── page.tsx
│   │   ├── listening/
│   │   │   └── page.tsx
│   │   ├── writing/
│   │   │   └── page.tsx
│   │   └── speaking/
│   │       └── page.tsx
│   │
│   ├── mock-tests/
│   │   ├── page.tsx             # Mock test list
│   │   ├── [id]/
│   │   │   ├── page.tsx         # Taking test
│   │   │   └── result/
│   │   │       └── page.tsx
│   │
│   ├── courses/
│   │   ├── page.tsx             # Course list
│   │   └── [slug]/
│   │       └── page.tsx         # Course detail
│   │
│   ├── profile/
│   │   └── page.tsx
│   │
│   ├── pricing/
│   │   └── page.tsx
│   │
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   └── api/
│       ├── courses/
│       │   └── route.ts
│       ├── lessons/
│       │   └── route.ts
│       ├── tests/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── submit/
│       │           └── route.ts
│       └── progress/
│           └── route.ts
│
├── html-uipage/                 # Raw HTML from Stitch AI
│
│
├── public/
│   ├── images/
│   └── icons/
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── constants.ts
│
├── services/
│   ├── course.service.ts
│   ├── test.service.ts
│   └── progress.service.ts
│
├── types/
│   ├── course.ts
│   ├── test.ts
│   ├── user.ts
│   └── api.ts
│
├── utils/
│   ├── auth.ts
│   └── format.ts
│
├── .gitignore
├── AI_PRODUCT_SPEC.md
├── next-env.d.ts
├── next.config.ts
├── postcss.config.mjs
├── package.json
├── package-lock.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md



---

# 7. AUTHENTICATION (SUPABASE)

## Authentication Flow
- Email & Password
- Google OAuth
- JWT handled by Supabase
- Session stored via Supabase client

## Protected Routes
The following routes require authentication:
- /dashboard
- /practice/*
- /mock-tests/*
- /profile
- /courses/enrolled

Unauthenticated users must be redirected to `/login`.

---

# 8. DATABASE DESIGN (SUPABASE POSTGRES)

## Tables

### profiles
```sql
id uuid primary key references auth.users(id)
full_name text
avatar_url text
target_band numeric
created_at timestamp

courses
id uuid primary key
title text
slug text unique
description text
level text
thumbnail text
is_active boolean

lessons
id uuid primary key
course_id uuid references courses(id)
title text
content text
order_index int


practice_tests
id uuid primary key
title text
skill text
duration int

questions
id uuid primary key
test_id uuid references practice_tests(id)
type text
content text
options jsonb
correct_answer text


test_attempts
id uuid primary key
user_id uuid
test_id uuid
score numeric
submitted_at timestamp

progress
id uuid primary key
user_id uuid
course_id uuid
completed_lessons int
updated_at timestamp


9. BACKEND API DESIGN (NEXT.JS API ROUTES)
Course APIs
GET /api/courses
GET /api/courses/[slug]
GET /api/courses/[id]/lessons


Practice Test APIs
GET /api/tests
GET /api/tests/[id]
POST /api/tests/[id]/submit


Progress APIs
GET /api/progress

All APIs return JSON and must use Supabase queries.

10. PAGE IMPLEMENTATION RULES

For each page:

Locate corresponding HTML file in /html-ui-page

Convert HTML to React component

Extract reusable components

Connect data using Supabase client

Add loading, empty, and error states

Ensure full responsiveness

11. AI CODING RULES (VERY IMPORTANT)

Use TypeScript everywhere

Use Server Components by default

Use Client Components only when necessary

Use Supabase server client for secure queries

Avoid hardcoded data

Write production-ready code

Follow clean and scalable architecture

12. FUTURE FEATURES (DO NOT IMPLEMENT NOW)

AI Writing evaluation

AI Speaking evaluation

Payment & subscription system

Admin CMS

13. FINAL EXPECTATION

The final output must be:

A fully working full-stack Next.js application

Supabase integrated (Auth, DB, Storage)

Fully responsive UI

Clean, maintainable codebase

Ready for real users