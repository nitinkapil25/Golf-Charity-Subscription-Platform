# Golf Charity Subscription Platform

A Next.js + Supabase app where users can subscribe, log golf scores, participate in monthly draws, and support charities.

## Features
- Authentication (Supabase email/password)
- Score system (1-45, latest 5 retained)
- Charity selection
- Draw system with prize tiers
- Admin panel (profiles, scores, draws, winners)

## Tech Stack
- Next.js 14 (App Router)
- Supabase (Postgres + Auth)
- Tailwind CSS

## Routes
- `/` Home
- `/login` Login
- `/signup` Signup
- `/dashboard` User dashboard
- `/admin` Admin panel (restricted by email)

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Optional (admin access)
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

3. Run the dev server:
```bash
npm run dev
```

## Database Notes
- `scores.user_id` references `profiles.id`
- Ensure `profiles` rows exist for users (RLS policy or trigger)
- `draws.match_count` is required for winners reporting

Recommended SQL for the draw match count column:
```sql
alter table public.draws
add column if not exists match_count int;
```

## Submission Notes
- Subscription flow is UI-only (no payments)
- All data is managed through Supabase Auth and Postgres
