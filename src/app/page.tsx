import { loginAction } from "./actions";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-center">LedgerFlow</h1>
        <p className="text-gray-400 text-center mb-8">
          Secure P2P Banking Simulator
        </p> 

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Login as</label>
            <input
              name="username"
              type="text"
              placeholder="e.g. Alice"
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition"
          >
            Access Wallet
          </button>
        </form>

        <div className="mt-6 text-xs text-center text-gray-500">
          Tip: Try logging in as "Alice" or "Bob"
        </div>
      </div>
    </main>
  );
}
