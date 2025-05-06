import {auth, signIn, signOut} from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div className="">
      test<br />
      {session && (
        <form action={async () => {
          'use server';
          await signOut();
        }}>
          <button
            className="py-3 px-5 bg-white text-black rounded-full hover:bg-blue-700 transition duration-300 font-medium flex items-center justify-center gap-2 mx-auto"
            type="submit">Logout
          </button>
        </form>
      )}
      {!session && (
        <form action={async () => {
          'use server';
          await signIn('google');
        }}>
          <button
            className="py-3 px-5 bg-white text-black rounded-full hover:bg-blue-700 transition duration-300 font-medium flex items-center justify-center gap-2 mx-auto"
            type="submit"><img src="/google.png" alt="" className="w-5 h-5" />Login with google
            
          </button>
        </form>
      )}

    </div>
  );
}
