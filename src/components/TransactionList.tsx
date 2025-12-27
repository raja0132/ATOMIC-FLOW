"use client"; 

import { Transaction } from "@/lib/ledger";
import { loadMoreTransactions } from "@/app/actions";
import { useState,useEffect } from "react";

interface Props {
  initialTransactions: Transaction[];
  initialKey?: any; 
  username: string;
}

export default function TransactionList({ initialTransactions, initialKey, username }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [lastKey, setLastKey] = useState<any>(initialKey);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
   
    setTransactions(initialTransactions);
    setLastKey(initialKey);
}, [initialTransactions, initialKey]); 

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const data = await loadMoreTransactions(username, lastKey);
      
      setTransactions((prev) => [...prev, ...data.transactions]);
      
      setLastKey(data.lastKey);
    } catch (error) {
      console.error("Failed to load transactions", error);
    }
    setLoading(false);
  };

  if (transactions.length === 0) {
    return <div className="text-gray-500 text-center">No transactions yet.</div>;
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* List of Transactions */}
      {transactions.map((tx) => (
        <div key={tx.id} className="flex justify-between items-center p-4 border-b border-gray-700 last:border-0">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
              ${tx.type === 'CREDIT' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
              {tx.type === 'CREDIT' ? '↓' : '↑'}
            </div>
            <div>
              <p className="font-bold text-gray-200">
                {tx.type === 'CREDIT' ? `From ${tx.counterparty}` : `To ${tx.counterparty}`}
              </p>
              <p className="text-xs text-gray-500">{tx.date}</p>
            </div>
          </div>
          <div className={`font-mono font-bold ${tx.type === 'CREDIT' ? 'text-green-400' : 'text-gray-200'}`}>
            {tx.type === 'CREDIT' ? '+' : ''}₹{Math.abs(tx.amount/100).toLocaleString('en-IN',{minimumFractionDigits: 2, 
      maximumFractionDigits: 2})}
          </div>
        </div>
      ))}

      {/* Load More Button */}
      {lastKey && (
        <div className="p-4 text-center border-t border-gray-700">
          <button 
            onClick={handleLoadMore} 
            disabled={loading}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More Activity ↓"}
          </button>
        </div>
      )}
    </div>
  );
}