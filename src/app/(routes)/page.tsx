import { auth, signIn, signOut } from "@/auth";
import EmailLoginForm from "@/components/EmailLoginForm";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-black overflow-hidden px-4">
      {/* Stars omitted for brevity */}

      <div className="relative z-10 bg-white/10 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-full max-w-md text-center border border-white/10">
        {/* Moon icon omitted */}

        <h1 className="text-3xl font-semibold text-white mb-3">Welcome to SleepSense</h1>
        <p className="text-indigo-200 mb-8">Your personalized sleep companion</p>

        {session ? (
          <form action={async () => { "use server"; await signOut(); }}>
            <button
              type="submit"
              className="w-full py-3 px-5 bg-red-800/80 text-white rounded-full hover:bg-red-700 transition duration-300 font-medium"
            >
              Logout
            </button>
          </form>
        ) : (
          <>
            <form action={async () => { "use server"; await signIn("google"); }}>
              <button
                type="submit"
                className="w-full py-3 px-5 bg-white text-gray-900 rounded-full hover:bg-gray-200 transition duration-300 font-medium flex items-center justify-center gap-3"
              >
                <img src="/google.png" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-white/20" />
              <span className="px-3 text-white/50 text-sm">or</span>
              <div className="flex-grow h-px bg-white/20" />
            </div>

            {/* Email login component */}
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
