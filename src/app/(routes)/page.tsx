import { auth, signIn, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-black overflow-hidden px-4">
      {/* Floating stars */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 40 }).map((_, i) => (
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
        ))}
      </div>

      {/* Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-full max-w-md text-center border border-white/10">
        {/* Moon icon */}
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

        <h1 className="text-3xl font-semibold text-white mb-3">Welcome to SleepSense</h1>
        <p className="text-indigo-200 mb-8">Your personalized sleep companion</p>

        {session ? (
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="w-full py-3 px-5 bg-red-800/80 text-white rounded-full hover:bg-red-700 transition duration-300 font-medium flex items-center justify-center gap-2"
            >
              Logout
            </button>
          </form>
        ) : (
          <>
            {/* Google Login */}
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <button
                type="submit"
                className="w-full py-3 px-5 bg-white text-gray-900 rounded-full hover:bg-gray-200 transition duration-300 font-medium flex items-center justify-center gap-3"
              >
                <img src="/google.png" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>
            </form>

            {/* Separator */}
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-white/20" />
              <span className="px-3 text-white/50 text-sm">or</span>
              <div className="flex-grow h-px bg-white/20" />
            </div>

            {/* Email Login (UI only) */}
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full py-3 px-4 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full py-3 px-4 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <button
                type="button"
                className="w-full py-3 px-5 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition duration-300 font-medium"
              >
                Login with Email
              </button>
            </form>

            {/* Sign up prompt */}
            <p className="text-sm text-white/60 mt-6">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-indigo-300 underline hover:text-indigo-200 transition"
              >
                Sign up with email
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

