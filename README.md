# Golf Charity Subscription Platform

A full-stack web application where users can subscribe, enter their golf scores, participate in monthly draws, and support charities.

---

## 🚀 Features

* 🔐 Authentication (Signup/Login using Supabase)
* ⛳ Score System

  * Users can enter golf scores (1–45)
  * Only latest 5 scores are stored
* ❤️ Charity Selection

  * Users can select a charity to support
* 🎯 Draw System

  * Generates 5 random numbers
  * Matches with user scores
* 🏆 Prize Logic

  * 5 match → Jackpot
  * 4 match → Second tier
  * 3 match → Third tier
* 👨‍💻 Admin Panel

  * View all users
  * View scores
  * View draws

---

## 🛠 Tech Stack

* Frontend: Next.js (App Router)
* Backend: Supabase (Database + Auth)
* Styling: Tailwind CSS
* Deployment: Vercel

---

## ⚙️ Setup Instructions

1. Clone the repository:

```bash
git clone <your-repo-link>
cd project
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

4. Run the project:

```bash
npm run dev
```

---


## 🧠 How It Works

Users subscribe to the platform, enter their golf scores, and participate in a draw system. Based on matching scores, they can win rewards while also contributing to charity.

---

## 📌 Notes

* Subscription system is simulated (no real payment integration)
* Built as part of a full-stack development assignment
