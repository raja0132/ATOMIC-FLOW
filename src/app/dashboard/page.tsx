import { getUserData } from "@/app/actions";
import TransferForm from "@/components/TransferForm";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ user?: string }> }) {
  const params=await searchParams;
  const username = params.user;
  if (!username) redirect("/"); 

  
  const user = await getUserData(username);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <h1>User "{username}" not found. Run the seed script!</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-bold text-gray-400">LedgerFlow</h1>
          <Link href="/" className="text-sm text-blue-400 hover:underline">Log Out</Link>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl shadow-2xl mb-6">
          <p className="text-blue-100 text-sm font-medium mb-1">Total Balance</p>
          <h2 className="text-4xl font-bold">₹{user.balance.toLocaleString()}</h2>
          <p className="text-blue-200 text-xs mt-2">Wallet ID: {user.username}</p>
        </div>

        {/* Action Form */}
        <TransferForm currentUser={user.username} />

      </div>
    </div>
  );
}