"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ScatterChart, Scatter, ZAxis
} from "recharts";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sleepData, setSleepData] = useState<any[]>([]);

  // Fetch data from Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("daily_inputs")
        .select("*")
        .order("bedtime", { ascending: false });

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        // Optional: parse/format fields like duration or time
        setSleepData(data.map((entry) => ({
          date: entry.bedtime?.split("T")[0],
          duration: calculateSleepDuration(entry.bedtime, entry.wake_time),
          restfulness: Number(entry.restfulness),
          caffeine: entry.caffeine_time ? parseHour(entry.caffeine_time) : null,
          stress: Number(entry.stress),
          bedtime: parseHour(entry.bedtime),
          wake: parseHour(entry.wake_time),
        })));
      }
    };

    fetchData();
  }, []);

  // Helpers
  const calculateSleepDuration = (bedtime: string, wakeTime: string) => {
    if (!bedtime || !wakeTime) return null;
    const bed = new Date(bedtime);
    const wake = new Date(wakeTime);
    const hours = (wake.getTime() - bed.getTime()) / (1000 * 60 * 60);
    return parseFloat(hours.toFixed(1));
  };

  const parseHour = (timeStr: string) => {
    if (!timeStr) return null;
    const date = new Date(timeStr);
    return date.getHours() + date.getMinutes() / 60;
  };

  const average = (arr: number[] | (number | null)[]) => {
  const valid = arr.filter((n): n is number => typeof n === 'number');
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
};

const formatHour = (hour: number | null) => {
  if (hour === null || isNaN(hour)) return "—";
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  const time = new Date();
  time.setHours(h);
  time.setMinutes(m);
  return time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const formatHourLabel = (hourDecimal: number) => {
  if (hourDecimal == null) return "";
  const hour = Math.floor(hourDecimal);
  const minutes = Math.round((hourDecimal - hour) * 60);
  const date = new Date();
  date.setHours(hour, minutes);
  return format(date, "h:mm a");
};


const calculateConsistency = (data: any[]) => {
  if (data.length < 2) return "—";

  const bedtimes = data.map(d => new Date(d.bedtime).getTime()).filter(t => !isNaN(t));
  const waketimes = data.map(d => new Date(d.wake_time).getTime()).filter(t => !isNaN(t));

  if (bedtimes.length !== waketimes.length) return "—";

  const avgBedtime = bedtimes.reduce((a, b) => a + b, 0) / bedtimes.length;
  const avgWake = waketimes.reduce((a, b) => a + b, 0) / waketimes.length;

  const THIRTY_MIN_MS = 30 * 60 * 1000;

  const consistentDays = bedtimes.reduce((count, bed, i) => {
    const wake = waketimes[i];
    const isBedConsistent = Math.abs(bed - avgBedtime) <= THIRTY_MIN_MS;
    const isWakeConsistent = Math.abs(wake - avgWake) <= THIRTY_MIN_MS;
    return isBedConsistent && isWakeConsistent ? count + 1 : count;
  }, 0);

  const score = (consistentDays / bedtimes.length) * 100;
  return score.toFixed(0);
};

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
        <div className="bg-indigo-600 p-4 rounded-xl shadow">
          🛌 <p>Avg Sleep: {average(sleepData.map(d => d.duration))?.toFixed(1) ?? "—"} hrs</p>
        </div>
        <div className="bg-green-600 p-4 rounded-xl shadow">
          😌 <p>Avg Restfulness: {average(sleepData.map(d => d.restfulness))?.toFixed(1) ?? "—"}</p>
        </div>
        <div className="bg-yellow-600 p-4 rounded-xl shadow">
          ☕ <p>
            Avg Caffeine Time: {
              formatHour(average(sleepData.map(d => d.caffeine).filter(v => v !== null)))
            }
          </p>
        </div>
        <div className="bg-purple-600 p-4 rounded-xl shadow">
          🔁 <p>Consistency Score: {calculateConsistency(sleepData)}%</p>
        </div>
      </div>


      {/* 3. Trends Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* a. Sleep Duration Trends */}
        <div className="bg-gray-800 p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Sleep Duration Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sleepData}>
              <CartesianGrid stroke="#444" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 12]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="duration" fill="#ffc658" name="Sleep Duration (hrs)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 7. Bedtime and Wake Time Line Graphs */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Bedtime Line Chart */}
          <div className="bg-gray-800 p-4 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">Bedtime Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={sleepData}>
                <CartesianGrid stroke="#444" />
                <XAxis dataKey="date" />
                <YAxis domain={[18, 30]} tickFormatter={formatHourLabel} />
                <Tooltip formatter={(value: number) => formatHourLabel(value)} />
                <Line type="monotone" dataKey="bedtime" stroke="#7c3aed" name="Bedtime" />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Wake-up Line Chart */}
          <div className="bg-gray-800 p-4 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">Wake-up Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={sleepData}>
                <CartesianGrid stroke="#444" />
                <XAxis dataKey="date" />
                <YAxis domain={[4, 12]} tickFormatter={formatHourLabel} />
                <Tooltip formatter={(value: number) => formatHourLabel(value)} />
                <Line type="monotone" dataKey="wake" stroke="#10b981" name="Wake-up Time" />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
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

