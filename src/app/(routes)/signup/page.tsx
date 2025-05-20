"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for a verification link!");
    }
  };

  function AnimatedStars() {
  const [stars, setStars] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const starElements = Array.from({ length: 40 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-[2px] h-[2px] bg-white rounded-full animate-pulse"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 4}s`,
          opacity: Math.random() * 0.6 + 0.2,
        }}
      />
    ));
    setStars(starElements);
  }, []);

  return <>{stars}</>;
}

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-black overflow-hidden px-4">
      {/* Floating stars */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <AnimatedStars />
    </div>

      {/* Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-full max-w-md text-center border border-white/10">
        <div className="flex justify-center mb-4 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-indigo-300 drop-shadow-glow"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21.75 15.5a9.75 9.75 0 01-12.25-12A10 10 0 1018 21.75a9.63 9.63 0 003.75-6.25z" />
          </svg>
        </div>

        <h1 className="text-3xl font-semibold text-white mb-3">Create an account</h1>
        <p className="text-indigo-200 mb-8">Join SleepSense today</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="fullName"
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full py-3 px-4 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full py-3 px-4 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full py-3 px-4 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full py-3 px-4 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-5 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition duration-300 font-medium"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-white/60 mt-6">
          Already have an account?{" "}
          <Link
            href="/"
            className="text-indigo-300 underline hover:text-indigo-200 transition"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
