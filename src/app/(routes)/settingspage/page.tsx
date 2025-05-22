"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setFullName(user?.user_metadata?.full_name || "");
    };
    getUser();
  }, []);

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    if (error) alert(error.message);
    else alert("Name updated!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-black px-4">
      <div className="bg-white/10 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-full max-w-md text-center border border-white/10 text-white">
        <h1 className="text-3xl font-semibold mb-4">Settings</h1>

        {user ? (
          <>
            <p className="text-sm text-white/60 mb-6">Logged in as <span className="font-medium">{user.email}</span></p>

            <div className="space-y-4 text-left">
              <label className="block">
                <span className="text-white/70">Full Name</span>
                <input
                  type="text"
                  className="mt-1 block w-full bg-white/20 text-white rounded-xl px-4 py-2 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </label>

              <button
                onClick={handleUpdate}
                className="w-full py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition"
              >
                Update Name
              </button>

              <button
                onClick={handleLogout}
                className="w-full py-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition"
              >
                Log Out
              </button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
