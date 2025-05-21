import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import EmailLoginForm from "@/components/EmailLoginForm";
import Link from "next/link";
import { AnimatedBackground, MoonIcon } from "@/components/AnimatedBackground";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-black overflow-hidden px-4">
      {/* Floating stars */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <AnimatedBackground />
      </div>

      {/* Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-full max-w-md text-center border border-white/10">
        <MoonIcon />

        <h1 className="text-3xl font-semibold text-white mb-3">Welcome to SleepSense</h1>
        <p className="text-indigo-200 mb-8">Your personalized sleep companion</p>

        {session ? (
          <p className="text-white/80">You're already signed in.</p>
        ) : (
          <>
            <GoogleLoginButton />

            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-white/20" />
              <span className="px-3 text-white/50 text-sm">or</span>
              <div className="flex-grow h-px bg-white/20" />
            </div>

            <EmailLoginForm />

            <p className="text-sm text-white/60 mt-6">
              Don't have an account?{" "}
              <Link href="/signup">
                <button
                  type="button"
                  className="text-indigo-300 underline hover:text-indigo-200 transition"
                >
                  Sign up with email
                </button>
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
