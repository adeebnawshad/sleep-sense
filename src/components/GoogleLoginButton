"use client";

import { supabase } from "@/lib/supabaseClient";

export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full py-3 px-5 bg-white text-gray-900 rounded-full hover:bg-gray-200 transition duration-300 font-medium flex items-center justify-center gap-3"
    >
      <img src="/google.png" alt="Google" className="w-5 h-5" />
      Continue with Google
    </button>
  );
}
