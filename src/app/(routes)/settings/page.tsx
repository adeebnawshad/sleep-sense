"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function SettingsPage() {
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [tipsEnabled, setTipsEnabled] = useState(true);
  const [screenTracking, setScreenTracking] = useState(false);
  const [advancedStats, setAdvancedStats] = useState(true);
  const [reminderTime, setReminderTime] = useState("08:00");
  const [theme, setTheme] = useState("dark");
  const [accentColor, setAccentColor] = useState("indigo");
  const [fontSize, setFontSize] = useState("medium");

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Account Settings */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-2">Account</h2>
        <p>Email: user@example.com</p>
        <Button variant="secondary" className="mt-2">Change Password</Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="mt-2">Delete Account</Button>
          </DialogTrigger>
          <DialogContent>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <Button variant="destructive">Confirm Delete</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tracking Preferences */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-2">Tracking Preferences</h2>
        <div className="flex items-center justify-between mb-2">
          <label>Daily input reminders</label>
          <Switch checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
        </div>
        <div className="flex items-center justify-between mb-2">
          <label>Include lifestyle tips</label>
          <Switch checked={tipsEnabled} onCheckedChange={setTipsEnabled} />
        </div>
        <div className="flex items-center justify-between mb-2">
          <label>Track screen time</label>
          <Switch checked={screenTracking} onCheckedChange={setScreenTracking} />
        </div>
        <div className="flex items-center justify-between">
          <label>Show advanced stats</label>
          <Switch checked={advancedStats} onCheckedChange={setAdvancedStats} />
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-2">Appearance</h2>
        <div className="mb-2">
          <label className="block mb-1">Theme</label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="light">Light</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-2">
          <label className="block mb-1">Accent Color</label>
          <Select value={accentColor} onValueChange={setAccentColor}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="indigo">Indigo</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-1">Font Size</label>
          <Select value={fontSize} onValueChange={setFontSize}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-2">Notifications</h2>
        <label className="block mb-1">Reminder Time</label>
        <Input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="mb-2 text-black" />
        <label className="block mb-1">Frequency</label>
        <Select defaultValue="daily">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekdays">Weekdays</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Management */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-2">Data Management</h2>
        <Button className="mr-2">Export Data</Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Clear All Data</Button>
          </DialogTrigger>
          <DialogContent>
            <p>Are you sure you want to clear all data? This cannot be undone.</p>
            <Button variant="destructive">Confirm Clear</Button>
          </DialogContent>
        </Dialog>
      </div>

      <Button className="mt-4">Save Changes</Button>
    </div>
  );
}
