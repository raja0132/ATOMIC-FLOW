import { signIn } from "@/auth";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-6">LedgerFlow</h1>
        
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded flex items-center justify-center gap-2"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </main>
  );
}