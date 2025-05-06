"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function DailyInputPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ naps: [] });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addNap = () => {
    setFormData((prev) => ({
      ...prev,
      naps: [...(prev.naps || []), { start: "", end: "" }],
    }));
  };

  const handleNapChange = (index, field, value) => {
    const newNaps = [...formData.naps];
    newNaps[index][field] = value;
    setFormData((prev) => ({ ...prev, naps: newNaps }));
  };

  const removeNap = (index) => {
    const newNaps = formData.naps.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, naps: newNaps }));
  };

  const requiredStepFields = {
    1: ["bedtime", "wakeTime"],
    2: ["restedRating", "sleepLatency"],
    3: ["hadCaffeine", "lastMealTime"],
    4: ["screenTime", "blueLightFilter"],
  };

  const isStepValid = () => {
    const requiredFields = requiredStepFields[step] || [];
    return requiredFields.every((field) => formData[field]);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center text-white p-4 overflow-y-auto"
      style={{ backgroundImage: "url('/stars-bg.jpg')" }}
    >
      <Card className="bg-gray-900 text-white w-full max-w-2xl p-8 rounded-2xl shadow-lg">
        <CardContent>
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Step 1: Sleep Timing</h2>
              <Label className="block mb-2">What time did you go to bed?</Label>
              <Input
                type="datetime-local"
                className="mb-4 text-white"
                onChange={(e) => handleChange("bedtime", e.target.value)}
              />
              <Label className="block mb-2">What time did you wake up?</Label>
              <Input
                type="datetime-local"
                className="mb-4 text-white"
                onChange={(e) => handleChange("wakeTime", e.target.value)}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Step 2: Sleep Experience</h2>
              <Label className="block mb-2">How well rested do you feel today? (1–5)</Label>
              <Select onValueChange={(val) => handleChange("restedRating", val)}>
                <SelectTrigger className="mb-4 text-white">
                  <SelectValue placeholder="Select rating" className="text-white" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Not at all</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5 - Very well rested</SelectItem>
                </SelectContent>
              </Select>
              <Label className="block mb-2">How long did it take to fall asleep?</Label>
              <Select onValueChange={(val) => handleChange("sleepLatency", val)}>
                <SelectTrigger className="mb-4 text-white">
                  <SelectValue placeholder="Select duration" className="text-white" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<10">Less than 10 min</SelectItem>
                  <SelectItem value="10-20">10–20 min</SelectItem>
                  <SelectItem value="20-30">20–30 min</SelectItem>
                  <SelectItem value=">30">More than 30 min (specify)</SelectItem>
                </SelectContent>
              </Select>
              {formData.sleepLatency === ">30" && (
                <Input
                  type="text"
                  placeholder="Specify duration"
                  className="mb-4 text-white"
                  onChange={(e) => handleChange("sleepLatencyDetail", e.target.value)}
                />
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Step 3: Lifestyle Before Bed</h2>
              <Label className="block mb-2">Did you have caffeine yesterday?</Label>
              <Select onValueChange={(val) => handleChange("hadCaffeine", val)}>
                <SelectTrigger className="mb-4 text-white">
                  <SelectValue placeholder="Select" className="text-white" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              {formData.hadCaffeine === "yes" && (
                <>
                  <Label className="block mb-2">What time did you have your last caffeine?</Label>
                  <Input
                    type="time"
                    className="mb-4 text-white"
                    onChange={(e) => handleChange("caffeineTime", e.target.value)}
                  />
                </>
              )}
              <Label className="block mb-2">What time did you eat your last meal?</Label>
              <Input
                type="time"
                className="mb-4 text-white"
                onChange={(e) => handleChange("lastMealTime", e.target.value)}
              />
              <Label className="block mb-2">Did you take any naps?</Label>
              {formData.naps.map((nap, index) => (
                <div key={index} className="flex gap-2 items-center mb-2">
                  <Input
                    type="time"
                    className="text-white"
                    value={nap.start}
                    onChange={(e) => handleNapChange(index, "start", e.target.value)}
                  />
                  <Input
                    type="time"
                    className="text-white"
                    value={nap.end}
                    onChange={(e) => handleNapChange(index, "end", e.target.value)}
                  />
                  <Button type="button" onClick={() => removeNap(index)}>
                    ✕
                  </Button>
                </div>
              ))}
              <Button type="button" className="mb-4" onClick={addNap}>
                Add Nap
              </Button>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Step 4: Screen Use</h2>
              <Label className="block mb-2">When was the last time you used screens before bed?</Label>
              <Input
                type="time"
                className="mb-4 text-white"
                onChange={(e) => handleChange("screenTime", e.target.value)}
              />
              <Label className="block mb-2">Did you use a blue light filter?</Label>
              <Select onValueChange={(val) => handleChange("blueLightFilter", val)}>
                <SelectTrigger className="mb-4 text-white">
                  <SelectValue placeholder="Select" className="text-white" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Step 6: Review & Submit</h2>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
              <Button className="mt-4">Submit</Button>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 ? <Button onClick={prevStep}>Back</Button> : <span />}
            <Button onClick={nextStep} disabled={!isStepValid()}>
              {step === 6 ? "Finish" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
