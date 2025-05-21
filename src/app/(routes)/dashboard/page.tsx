"use client";

import { useMemo, useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ScatterChart, Scatter, ZAxis
} from "recharts";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sleepData, setSleepData] = useState<any[]>([]);
  const [selectedLatencyFactor, setSelectedLatencyFactor] = useState("sunlight");
  const [selectedRestfulnessFactor, setSelectedRestfulnessFactor] = useState("caffeine");
  const router = useRouter();

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
        setSleepData(
          data.map((entry) => {
            const latencyMinutes = getSleepLatencyInMinutes(
              entry.sleep_latency,
              entry.custom_latency_minutes
            );

            return {
              date: entry.bedtime?.split("T")[0],
              duration: calculateSleepDuration(
                entry.bedtime,
                entry.wake_time,
                entry.sleep_latency,
                entry.custom_latency_minutes,
                entry.disturbance_duration_minutes,
                entry.nap_duration_minutes
              ),
              latency: latencyMinutes,
              restfulness: Number(entry.restfulness),
              caffeine: entry.caffeine ? parseHour(entry.caffeine_time) : null,
              stress: Number(entry.stress),
              bedtime: parseHour(entry.bedtime),
              wake: parseHour(entry.wake_time),

              // ✅ REQUIRED for graphs
              sleep_latency_minutes: latencyMinutes,
              sunlight_hours: entry.sunlight_hours ?? null,
              bedtime_sunlight_gap: entry.bedtime_sunlight_gap ?? null,
              bedtime_exercise_gap: entry.bedtime_exercise_gap ?? null,
              exercise_intensity: entry.exercise_intensity ?? null,
              bedtime_nap_gap: entry.bedtime_nap_gap ?? null,
              nap_duration_minutes: entry.nap_duration_minutes ?? null,
              screen_time: entry.screen_time ?? null,
              blue_light_filter: entry.blue_light_filter ?? null,
              bright_light_before_bed: entry.bright_light_before_bed ?? null,
              room_temp: entry.room_temp ?? null,
              alcohol: entry.alcohol ?? null,
            };
          })
        );

      }
    };

    fetchData();
  }, []);

  const handleDateSelect = (date: Date) => {
    const formatted = format(date, "yyyy-MM-dd");
    router.push(`/daily-input?date=${formatted}`);
  };

  function getSleepLatencyInMinutes(latency: string, custom?: number) {
  switch (latency) {
    case "<10":
      return 5;
    case "10-20":
      return 15;
    case "20-30":
      return 25;
    case ">30":
      return custom || 30; // fallback in case custom is missing
    default:
      return 0;
  }
}

  // Helpers
  const calculateSleepDuration = (
  bedtime: string,
  wakeTime: string,
  latency: string,
  customLatency?: number,
  disturbances?: number,
  naps?: number
) => {
  if (!bedtime || !wakeTime) return null;

  const bed = new Date(bedtime).getTime();
  const wake = new Date(wakeTime).getTime();

  const latencyMinutes = getSleepLatencyInMinutes(latency, customLatency);
  const disturbanceMinutes = disturbances ?? 0;
  const napMinutes = naps ?? 0;

  const totalMinutes = (wake - bed) / (1000 * 60) - latencyMinutes - disturbanceMinutes + napMinutes;
  const totalHours = totalMinutes / 60;

  return parseFloat(totalHours.toFixed(1));
};


  const parseHour = (timeStr: string) => {
    if (!timeStr) return null;
    const date = new Date(timeStr);
    let hour = date.getHours() + date.getMinutes() / 60;
    if (hour < 6) {
      hour += 24; // shift early-morning hours to appear after midnight
    }
    return hour;
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

  const latencyFactors: { [key: string]: string } = {
  sunlight: "sunlight_hours",
  "bedtime - sunlight": "bedtime_sunlight_gap",
  "caffeine time": "caffeine",
  "bedtime - exercise time": "bedtime_exercise_gap",
  "exercise intensity": "exercise_intensity",
  "bedtime - nap end time": "bedtime_nap_gap",
  "nap duration": "nap_duration_minutes",
  "screen time": "screen_time",
  "blue light filter": "blue_light_filter",
  "bright light exposure": "bright_light_before_bed",
  stress: "stress",
  "room temperature": "room_temp",
};

const restfulnessFactors: { [key: string]: string } = {
  caffeine: "caffeine",
  alcohol: "alcohol",
  "exercise intensity": "exercise_intensity",
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
                <YAxis domain={[20, 30]} tickFormatter={formatHourLabel} />
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
        
      </div>

      {/* 4. Daily Breakdown */}
      <div className="bg-gray-900 p-4 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-2">Daily Breakdown</h2>
        <Calendar
          value={selectedDate}
          onChange={(date) => {
            setSelectedDate(date as Date);
            handleDateSelect(date as Date);
          }}
          className="bg-white rounded-xl text-black p-2"
        />
        <div className="mt-4">Selected Date: {format(selectedDate, "PPP")}</div>
        {/* Could expand with day-specific data */}
      </div>

      {/* Sleep Latency vs Factor */}


      {/* Restfulness vs Factor */}
     
      {/* 5. Personalized Insights */}
      <div className="bg-blue-800 p-4 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-2">Insights</h2>
        <ul className="list-disc list-inside">
          <li>You sleep better when you exercise before 8PM</li>
          <li>Your restfulness drops after caffeine post-4PM</li>
        </ul>
      </div>
    </div>
  );
}

