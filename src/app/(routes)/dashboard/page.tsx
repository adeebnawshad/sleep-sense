"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ScatterChart, Scatter, ZAxis
} from "recharts";
import Link from "next/link";


export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const sleepData = [
    { date: "2025-05-01", bedtime: 22, wake: 6, duration: 8, restfulness: 4, caffeine: 15, stress: 3 },
    { date: "2025-05-02", bedtime: 23, wake: 7, duration: 8, restfulness: 3, caffeine: 16, stress: 4 },
    { date: "2025-05-03", bedtime: 0, wake: 8, duration: 8, restfulness: 2, caffeine: 17, stress: 5 },
    // ...more data
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-900 text-white p-6">
      {/* 1. Top Nav */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">SleepSense</h1>
        <div className="flex gap-4 items-center">
            <Link href="/settings">
                <button className="bg-white text-black px-4 py-2 rounded">Settings</button>
            </Link>
          <div className="w-10 h-10 rounded-full bg-gray-500" />
        </div>
      </div>

      {/* 2. Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-indigo-600 p-4 rounded-xl shadow">🛌 <p>Avg Sleep: 7.8 hrs</p></div>
        <div className="bg-green-600 p-4 rounded-xl shadow">😌 <p>Avg Restfulness: 3.7</p></div>
        <div className="bg-yellow-600 p-4 rounded-xl shadow">☕ <p>Avg Caffeine Time: 3:45 PM</p></div>
        <div className="bg-purple-600 p-4 rounded-xl shadow">🔁 <p>Consistency Score: 82%</p></div>
      </div>

      {/* 3. Trends Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* a. Sleep Trends */}
        <div className="bg-gray-800 p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Sleep Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={sleepData}>
              <Line type="monotone" dataKey="bedtime" stroke="#8884d8" name="Bedtime (24h)" />
              <Line type="monotone" dataKey="wake" stroke="#82ca9d" name="Wake Time (24h)" />
              <Line type="monotone" dataKey="duration" stroke="#ffc658" name="Duration (hrs)" />
              <CartesianGrid stroke="#444" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* b. Restfulness vs Factors */}
        <div className="bg-gray-800 p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Restfulness vs Caffeine</h2>
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="caffeine" name="Caffeine Time" unit="h" />
              <YAxis type="number" dataKey="restfulness" name="Restfulness" />
              <ZAxis type="number" dataKey="stress" range={[60, 200]} name="Stress" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="User Data" data={sleepData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Daily Breakdown */}
      <div className="bg-gray-900 p-4 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-2">Daily Breakdown</h2>
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          className="bg-white rounded-xl text-black p-2"
        />
        <div className="mt-4">Selected Date: {format(selectedDate, "PPP")}</div>
        {/* Could expand with day-specific data */}
      </div>

      {/* 5. Personalized Insights */}
      <div className="bg-blue-800 p-4 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-2">Insights</h2>
        <ul className="list-disc list-inside">
          <li>You sleep better when you exercise before 8PM</li>
          <li>Your restfulness drops after caffeine post-4PM</li>
        </ul>
      </div>

      {/* 6. Lifestyle Patterns */}
      <div className="bg-gray-800 p-4 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">Lifestyle Patterns</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={sleepData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Bar dataKey="stress" fill="#ff7300" name="Stress Level" />
            <Bar dataKey="caffeine" fill="#387908" name="Caffeine Time" />
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

