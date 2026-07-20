"use client";

import { transferAction } from "@/app/actions";
import { useEffect, useRef, useState } from "react";
import { transactionState } from "@/app/types";
import { useActionState } from "react";
import { v4 as uuidv4 } from "uuid";
const initialState: transactionState = {
  success: false,
  message: "",
  error: null,
};

export default function TransferForm({
  currentUser,
  currentVersion,
}: {
  currentUser: string;
  currentVersion: string;
}) {
  const [state, formAction, isPending] = useActionState(
    transferAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [idempotencyKey, setIdempotencyKey] = useState(uuidv4());
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setIdempotencyKey(uuidv4());
    }
  }, [state]);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg mt-6">
      <h3 className="text-xl font-bold mb-4"> Send Money</h3>

      <form ref={formRef} action={formAction} className="space-y-4">
        <input type="hidden" name="fromUser" value={currentUser} />
        <input type="hidden" name="version" value={currentVersion} />
         <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400">Recipient ID</label>
            <input
              name="toUser"
              placeholder="e.g. Bob"
              className="w-full p-3 bg-gray-900 rounded border border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Amount (₹)</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full p-3 bg-gray-900 rounded border border-gray-700 text-white"
            />
          </div>
        </div>

        <button
          className="w-full bg-green-600 hover:bg-green-700 py-3 rounded font-bold transition"
          disabled={isPending}
        >
          {isPending ? "sending..." : "Confirm Transfer"}
        </button>

        {/* Feedback Messages */}
        {state?.error && (
          <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">
            {state.error}
          </p>
        )}
        {state?.success && (
          <p className="text-green-400 text-sm text-center bg-green-900/20 p-2 rounded">
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
