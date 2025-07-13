"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function DailyInputPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [formData, setFormData] = useState({
    bedtime: "",
    wakeTime: "",
    sleepLatency: "",
    customLatency: "",
    restedRating: "",
    hadDisturbances: "",
    awakeDuration: "",
    morningLight: "",
    hadCaffeine: "",
    caffeineTime: "",
    naps: [],
    lastMealTime: "",
    exercised: "",
    exerciseTime: "",
    exerciseIntensity: "",
    screenTime: "",
    blueLightFilter: "",
    brightLight: "",
    had_alcohol: "",
    roomTemp: "",
    stressLevel: "",
  });

  const requiredStepFields = {
    1: ["bedtime", "wakeTime", "sleepLatency", "restedRating", "hadDisturbances", "awakeDuration"],
    2: ["morningLight", "hadCaffeine", "caffeineTime", "lastMealTime", "exercised", "exerciseIntensity", "exerciseTime"],
    3: ["screenTime", "blueLightFilter", "brightLight", "had_alcohol", "roomTemp", "stressLevel"],
  };

  const isStepValid = () => {
    const fields = (requiredStepFields as Record<number, string[]>)[step] || [];
    for (const field of fields) {
      if ((field === "awakeDuration" && formData.hadDisturbances === "no") ||
          (field === "custom_latency" && formData.sleepLatency === ">30") ||
          (field === "caffeineTime" && formData.hadCaffeine === "no") ||
          (field === "exerciseTime" && formData.exercised === "no") ||
          (field === "exerciseIntensity" && formData.exercised === "no")) {
        continue;
      }
      if (!formData[field]) return false;
    }
    return true;
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addNap = () => {
    setFormData((prev) => ({ ...prev, naps: [...prev.naps, { start: "", end: "" }] }));
  };

  const handleNapChange = (index, field, value) => {
    const updatedNaps = [...formData.naps];
    updatedNaps[index][field] = value;
    setFormData((prev) => ({ ...prev, naps: updatedNaps }));
  };

  const removeNap = (index) => {
    const updatedNaps = formData.naps.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, naps: updatedNaps }));
  };

  const sanitizeTime = (input: string) => {
     if (typeof input === "string" && input.trim() !== "") {
    return input;
  }
  return null;
  };

  const sanitizeIntensity = (val: any) =>
  typeof val === "string" && val.trim() ? val : null;


  const insertDailyInput = async (formData: any) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("User not authenticated:", userError);
      return { success: false, error: new Error("User not authenticated") };
    }

  const { data, error } = await supabase
    .from('daily_inputs')
    .insert([{
      user_id: user.id,
      bedtime: formData.bedtime,
      wake_time: formData.wakeTime,
      restfulness: formData.restedRating,
      time_to_sleep: formData.sleepLatency,
      custom_latency: formData.sleepLatency === ">30" ? Number(formData.customLatency) : null,

      caffeine: formData.hadCaffeine,
      caffeine_time: sanitizeTime(formData.caffeineTime),
      last_meal: formData.lastMealTime,

      naps: formData.naps,
      screen_use_time: formData.screenTime,
      blue_light_filter: formData.blueLightFilter,

      bright_light: formData.brightLight,
      morning_sunlight: formData.morningLight,
      had_alcohol: formData.had_alcohol,
      disturbances: formData.hadDisturbances === "yes" ? [{ duration: formData.awakeDuration }] : [],
      exercise: formData.exercised,
      exercise_intensity: sanitizeIntensity(formData.exerciseIntensity),
      exercise_time: sanitizeTime(formData.exerciseTime),

      stress: formData.stressLevel,
      room_temp: formData.roomTemp
    }]);

  if (error) {
    console.error('Insert error:', error.message, error.details);
    return { success: false, error };
  }

  return { success: true, data };
};



  const handleFinish = async () => {
    const result = await insertDailyInput(formData);

    if (result.success) {
      alert("Daily input saved!");
      router.push('/dashboard');
    } else {
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center text-white p-4 overflow-y-auto" style={{ backgroundImage: "url('/stars-bg.jpg')" }}>
      <Card className="bg-gray-900 text-white w-full max-w-2xl p-8 rounded-2xl shadow-lg">
        <CardContent>
          <form>
            {step === 1 && (
              <div>
                <Label>Bedtime</Label>
              <Input type="datetime-local" name="bedtime" className="mb-4" onChange={(e) => handleChange("bedtime", e.target.value)} />
              <Label>Wake-up Time</Label>
              <Input type="datetime-local" className="mb-4" onChange={(e) => handleChange("wakeTime", e.target.value)} />
              <Label>Time to Fall Asleep</Label>
              <Select onValueChange={(val) => handleChange("sleepLatency", val)}>
                <SelectTrigger className="mb-4">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<10">Less than 10 min</SelectItem>
                  <SelectItem value="10-20">10–20 min</SelectItem>
                  <SelectItem value="20-30">20–30 min</SelectItem>
                  <SelectItem value=">30">More than 30 min</SelectItem>
                </SelectContent>
              </Select>
              {/* Only show input if user selected ">30" */}
              {formData.sleepLatency === ">30" && (
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Approximate time to fall asleep (minutes)
                  </label>
                  <Input
                    type="number"
                    min={31}
                    placeholder="Enter minutes"
                    value={formData.customLatency}
                    onChange={(e) => handleChange("customLatency", e.target.value)}
                  />
                </div>
              )}
              <Label>Rested Rating (1–5)</Label>
              <Select onValueChange={(val) => handleChange("restedRating", val)}>
                <SelectTrigger className="mb-4">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <SelectItem key={val} value={String(val)}>{val}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label>Did you have sleep disturbances?</Label>
              <Select onValueChange={(val) => handleChange("hadDisturbances", val)}>
                <SelectTrigger className="mb-4">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              {formData.hadDisturbances === "yes" && (
                <>
                  <Label>Approximate time awake (minutes)</Label>
                  <Input type="number" className="mb-4" onChange={(e) => handleChange("awakeDuration", e.target.value)} />
                </>
              )}
              </div>
            )}
            {step === 2 && (
              <div>
                <Label>Did you get sunlight within 30 minutes of waking?</Label>
              <Select onValueChange={(val) => handleChange("morningLight", val)}>
                <SelectTrigger className="mb-4">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              <Label>Did you consume caffeine yesterday?</Label>
              <Select onValueChange={(val) => handleChange("hadCaffeine", val)}>
                <SelectTrigger className="mb-4">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              {formData.hadCaffeine === "yes" && (
                <>
                  <Label>What time?</Label>
                  <Input type="time" className="mb-4" onChange={(e) => handleChange("caffeineTime", e.target.value)} />
                </>
              )}
              <Label>Any naps?</Label>
              {formData.naps.map((nap, index) => (
                <div key={index} className="flex gap-2 mb-2 items-center">
                  <Input type="time" value={nap.start} onChange={(e) => handleNapChange(index, "start", e.target.value)} />
                  <Input type="time" value={nap.end} onChange={(e) => handleNapChange(index, "end", e.target.value)} />
                  <Button type="button" onClick={() => removeNap(index)}>✕</Button>
                </div>
              ))}
              <Button type="button" className="mb-4" onClick={addNap}>Add Nap</Button>
              <Label>Did you exercise yesterday?</Label>
              <Select onValueChange={(val) => handleChange("exercised", val)}>
                <SelectTrigger className="mb-4">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              {formData.exercised === "yes" && (
                <>
                  <Label>Intensity</Label>
                  <Select onValueChange={(val) => handleChange("exerciseIntensity", val)}>
                    <SelectTrigger className="mb-4">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="vigorous">Vigorous</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label>What time?</Label>
                  <Input type="time" className="mb-4" onChange={(e) => handleChange("exerciseTime", e.target.value)} />
                </>
              )}
              <Label>What time did you eat your last meal?</Label>
              <Input type="time" className="mb-4" onChange={(e) => handleChange("lastMealTime", e.target.value)} />
              </div>
            )}
            {step === 3 && (
              <div>
                <Label>Last screen use before bed</Label>
              <Input type="time" className="mb-4" onChange={(e) => handleChange("screenTime", e.target.value)} />
              <Label>Did you use a blue light filter?</Label>
              <Select onValueChange={(val) => handleChange("blueLightFilter", val)}>
                <SelectTrigger className="mb-4">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              <Label>Were you exposed to bright light before bed?</Label>
              <Select onValueChange={(val) => handleChange("brightLight", val)}>
                <SelectTrigger className="mb-4">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              <Label>Did you drink alcohol yesterday?</Label>
              <Select onValueChange={(val) => handleChange("had_alcohol", val)}>
                <SelectTrigger className="mb-4">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              <Label>Room temperature at bedtime</Label>
              <Select onValueChange={(val) => handleChange("roomTemp", val)}>
                <SelectTrigger className="mb-4">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>
              <Label>Stress level before bed (1 = No Stress, 5 = Very Stressed)</Label>
              <Select onValueChange={(val) => handleChange("stressLevel", val)}>
                <SelectTrigger className="mb-4">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <SelectItem key={val} value={String(val)}>{val}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            )}

            <div className="flex justify-between mt-6">
              {step > 1 ? (
                <Button type="button" onClick={() => setStep(step - 1)}>Back</Button>
              ) : <span />}

              {step === 3 ? (
                <Button type="button" onClick={handleFinish} disabled={!isStepValid()}>
                  Finish
                </Button>
              ) : (
                <Button type="button" onClick={() => setStep(step + 1)} disabled={!isStepValid()}>
                  Next
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
