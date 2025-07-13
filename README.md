# 💤 SleepSense

SleepSense is a full-stack web app designed to help users reflect on their daily habits and understand how they impact sleep quality. By logging lifestyle factors through a multi-step input form, users gain personalized insights and track their sleep trends over time.

---

## Features

### 🛌 Daily Input Form  
Multi-step form with time validation and dynamic fields to track:  
- Bedtime, wake time, sleep latency  
- Caffeine & alcohol intake  
- Screen time and blue light exposure  
- Exercise, stress levels, room temperature, sunlight exposure  
- Sleep disturbances and naps  

### 📊 Personal Dashboard  
View a calendar of daily entries and trends in:  
- Sleep duration (bar graph) — *Automatic Total Sleep Calculation:* total sleep = wake time - bedtime - sleep latency - disturbances + nap duration  
- Bedtime trends (line graph)  
- Wake-up time trends (line graph)  
- Lifestyle factors and sleep breakdowns  

### 🔐 User Authentication  
Secure Google login powered by Supabase and Google OAuth  

### 🧠 Insightful UI  
Responsive design built with Tailwind CSS and React for clean, intuitive visuals  

---

## Tech Stack

- **Frontend:** React, Next.js, TypeScript, Tailwind CSS  
- **Backend:** Supabase  
- **Charts:** Chart.js  

---

## How It Works

Users log daily sleep and lifestyle inputs through a beautifully designed multi-step form. Data is securely stored in Supabase, and the dashboard visualizes trends using interactive charts. The app's logic transforms raw inputs into actionable insights — helping users identify patterns and make better sleep decisions.

---

🌌 *Sleep better. Live better.* SleepSense is more than just a tracker — it’s a step toward a healthier, more informed lifestyle.

---

## 📂 Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/adeebnawshad/sleep-sense.git
cd sleep-sense
npm install
```

Run the development server:

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

## Resources

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
