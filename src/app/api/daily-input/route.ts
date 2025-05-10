// pages/api/daily-input.ts

import { prisma } from "@/lib/prisma"; // Adjust import if needed
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      bedtime,
      wakeTime,
      sleepLatency,
      restedRating,
      hadDisturbances,
      awakeDuration,
      morningLight,
      hadCaffeine,
      caffeineTime,
      naps,
      exerciseTime,
      exerciseIntensity,
      lastMealTime,
      screenTime,
      blueLightFilter,
      brightLight,
      roomTemp,
      stressLevel,
    } = req.body;

    // If you're using authentication, get userId from session
    const userId = "dummy-user-id"; // Replace with real user ID

    const input = await prisma.dailyInput.create({
      data: {
        userId,
        bedtime: new Date(bedtime),
        wakeTime: new Date(wakeTime),
        sleepLatency,
        restedRating: parseInt(restedRating),
        hadDisturbances: hadDisturbances === "yes",
        awakeDuration: awakeDuration ? parseInt(awakeDuration) : null,
        morningLight,
        hadCaffeine,
        caffeineTime: caffeineTime || null,
        naps,
        exerciseTime: exerciseTime || null,
        exerciseIntensity: exerciseIntensity || null,
        lastMealTime,
        screenTime,
        blueLightFilter,
        brightLight,
        roomTemp,
        stressLevel: parseInt(stressLevel),
      },
    });

    return res.status(200).json({ success: true, input });
  } catch (error) {
    console.error("Error creating daily input:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
