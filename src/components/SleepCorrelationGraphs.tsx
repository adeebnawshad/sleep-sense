import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DailyInput {
  date: string;
  bedtime: string;
  morning_sunlight: string;
  caffeine_time: string;
  exercise_time: string;
  exercise_intensity: number;
  naps: { end_time: string; duration: number }[];
  screen_use_time: string;
  blue_light_filter: boolean;
  bright_light: boolean;
  stress: number;
  room_temp: number;
  time_to_sleep: number;
  restfulness: number;
  caffeine: boolean;
  had_alcohol: boolean;
  disturbances: { duration: number }[];
}

const parseTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h + m / 60;
};

const getLatencyFactors = (entry: DailyInput) => {
  const bedtime = parseTime(entry.bedtime);
  const sunlight = parseTime(entry.morning_sunlight);
  const caffeine = parseTime(entry.caffeine_time);
  const exerciseTime = parseTime(entry.exercise_time);
  const napEnd = Math.max(...entry.naps.map((n) => parseTime(n.end_time)), 0);
  const napDuration = entry.naps.reduce((sum, n) => sum + n.duration, 0);
  const screenTime = parseTime(entry.screen_use_time);

  return {
    sunlight: sunlight,
    bedtime_sunlight: bedtime - sunlight,
    caffeine_time: caffeine,
    bedtime_exercise: bedtime - exerciseTime,
    exercise_intensity: entry.exercise_intensity,
    bedtime_nap_end: bedtime - napEnd,
    nap_duration: napDuration,
    screen_time: screenTime,
    blue_light_before_bed:
      bedtime - screenTime <= 1.5 ? (entry.blue_light_filter ? 1 : 0) : null,
    bright_light: entry.bright_light ? 1 : 0,
    stress: entry.stress,
    room_temp: entry.room_temp,
  };
};

const getRestfulnessFactors = (entry: DailyInput) => {
  return {
    caffeine: entry.caffeine ? 1 : 0,
    alcohol: entry.had_alcohol ? 1 : 0,
    exercise_intensity: entry.exercise_intensity,
  };
};

const getDisturbancesFactors = (entry: DailyInput) => {
  return {
    alcohol: entry.had_alcohol ? 1 : 0,
    stress: entry.stress,
    disturbance_count: entry.disturbances.length,
  };
};

const SleepCorrelationGraphs = ({ data }: { data: DailyInput[] }) => {
  const [latencyFactor, setLatencyFactor] = useState("sunlight");
  const [restFactor, setRestFactor] = useState("caffeine");
  const [disturbanceFactor, setDisturbanceFactor] = useState("alcohol");

  const latencyData = useMemo(() =>
    data.map((entry) => ({
      date: entry.date,
      factor: getLatencyFactors(entry)[latencyFactor],
      latency: entry.time_to_sleep,
    }))
    .filter((d) => d.factor !== null),
  [data, latencyFactor]);

  const restData = useMemo(() =>
    data.map((entry) => ({
      date: entry.date,
      factor: getRestfulnessFactors(entry)[restFactor],
      restfulness: entry.restfulness,
    }))
  , [data, restFactor]);

  const disturbanceData = useMemo(() =>
    data.map((entry) => ({
      date: entry.date,
      factor: getDisturbancesFactors(entry)[disturbanceFactor],
      disturbances: getDisturbancesFactors(entry).disturbance_count,
    }))
  , [data, disturbanceFactor]);

  return (
    <div className="space-y-6">
      {/* Sleep Latency Graph */}
      <div className="bg-gray-800 p-4 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">Sleep Latency vs. Factor</h2>
        <Select onValueChange={setLatencyFactor} defaultValue={latencyFactor}>
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Select a factor" />
          </SelectTrigger>
          <SelectContent>
            {[
              "sunlight",
              "bedtime_sunlight",
              "caffeine_time",
              "bedtime_exercise",
              "exercise_intensity",
              "bedtime_nap_end",
              "nap_duration",
              "screen_time",
              "blue_light_before_bed",
              "bright_light",
              "stress",
              "room_temp",
            ].map((key) => (
              <SelectItem key={key} value={key}>{key.replaceAll("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="factor" name="Factor" />
            <YAxis dataKey="latency" name="Sleep Latency (min)" />
            <Tooltip />
            <Scatter data={latencyData} fill="#7c3aed" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Restfulness Graph */}
      <div className="bg-gray-800 p-4 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">Restfulness vs. Factor</h2>
        <Select onValueChange={setRestFactor} defaultValue={restFactor}>
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Select a factor" />
          </SelectTrigger>
          <SelectContent>
            {[
              "caffeine",
              "alcohol",
              "exercise_intensity",
            ].map((key) => (
              <SelectItem key={key} value={key}>{key.replaceAll("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="factor" name="Factor" />
            <YAxis dataKey="restfulness" name="Restfulness (1–5)" />
            <Tooltip />
            <Scatter data={restData} fill="#34d399" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Disturbance Graph */}
      <div className="bg-gray-800 p-4 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">Sleep Disturbances vs. Factor</h2>
        <Select onValueChange={setDisturbanceFactor} defaultValue={disturbanceFactor}>
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Select a factor" />
          </SelectTrigger>
          <SelectContent>
            {[
              "alcohol",
              "stress",
            ].map((key) => (
              <SelectItem key={key} value={key}>{key.replaceAll("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="factor" name="Factor" />
            <YAxis dataKey="disturbances" name="# Disturbances" />
            <Tooltip />
            <Scatter data={disturbanceData} fill="#f59e0b" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SleepCorrelationGraphs;
