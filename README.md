🌙 Welcome to SleepSense 🛌
Your Personalized Guide to Better Sleep Through Data

About SleepSense
SleepSense is your daily companion for tracking sleep quality and uncovering how your lifestyle habits impact your rest. With an intuitive, multi-step input form and an insightful dashboard, SleepSense helps users reflect on their daily routines and build healthier sleep patterns over time.

Whether you're a night owl, an early bird, or somewhere in between — SleepSense gives you the tools to better understand your sleep and make informed lifestyle choices.

🧠 This project was built as a full-stack web application to explore data-driven wellness using modern web technologies.

🔑 Key Features

📝 Multi-Step Daily Tracker
Log your sleep habits, including bedtime, wake time, caffeine intake, exercise, screen time, stress, and more — all through a clean and engaging multi-step form.

📊 Visual Sleep Insights
Get an overview of your sleep trends and lifestyle behaviors with charts and summaries. Understand how your habits change over time.

⏱️ Sleep Latency Mapping
SleepSense intelligently maps sleep latency (time to fall asleep) into standardized values for meaningful insights.

🧮 Automatic Total Sleep Calculation
Total sleep is calculated with a custom formula:
wake time - bedtime - sleep latency - disturbances + nap duration.

💡 Correlation-Ready Design (Feature Paused)
Originally designed to show correlations between lifestyle habits and sleep quality (e.g., caffeine vs. restfulness), this feature is planned for future updates due to implementation complexity.

🧰 Tech Stack
Frontend: Next.js, React, Tailwind CSS, ShadCN UI
Backend/Database: Supabase (PostgreSQL, Auth)
Charts & Visualization: Chart.js
Other Tools: Vercel (for deployment), Date-fns, React Hook Form

🚀 How It Works
Users log daily sleep and lifestyle inputs through a beautifully designed multi-step form. Data is securely stored in Supabase, and the dashboard visualizes trends using interactive charts. The app's logic transforms raw inputs into actionable insights — helping users identify patterns and make better sleep decisions.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
