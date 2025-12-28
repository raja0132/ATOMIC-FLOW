"use server";
import { getBalance, getHistory } from "@/lib/ledger";
import { transferFunds } from "@/lib/transaction";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { transactionState } from "./types";
import { auth } from "@/auth";
import { version } from "os";

export async function getUserData(username: string) {
  const [balanceData, historyData] = await Promise.all([
    getBalance(username),
    getHistory(username),
  ]);
  if (balanceData === null) return null;
  return {
    name: balanceData.Name,
    balance: (balanceData.Balance / 100).toFixed(2),
    username: username,
    version:balanceData.Version,
    transactions: historyData.transactions,
    lastKey: historyData.lastKey,
  };
}

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  redirect(`/dashboard?user=${username}`);
}
export async function transferAction(
  prevState: transactionState,
  formData: FormData
): Promise<transactionState> {
  const session = await auth();
  if (!session?.user?.email) {
    return {
      success: false,
      message: "Failed to add transaction",
      error: "Unauthorized",
    };
  }
  const fromUser = session.user.email;
  const toUser = formData.get("toUser") as string;
  const amountRaw = formData.get("amount") as string;
  const decimalAmount = parseFloat(amountRaw);
  const amountInpaise = Math.round(decimalAmount * 100);
  const currentVersion=parseInt(formData.get("version") as string);
  if (!fromUser || !toUser || !amountInpaise || amountInpaise <= 0) {
    return {
      success: false,
      message: "Failed to add transaction",
      error: "Unauthorized",
    };
  }
  try {
    await transferFunds({
      fromUser,
      toUser,
      amount: amountInpaise,
    currentVersion
    });
    revalidatePath("/dashboard");
    return {
      success: true,
      message: `sent ${amountRaw} to ${toUser}`,
      error: null,
    };
  } catch (error: any) {
    if (error.message === "INSUFFICIENT_FUNDS") {
      return {
        success: false,
        message: "Failed: You don't have enough money",
        error: "Failed: You don't have enough money",
      };
    }
    return {
      success: false,
      message: "System Error: Transaction failed",
      error: "System Error: Transaction failed",
    };
  }
}

export async function loadMoreTransactions(username: string, lastKey: any) {
  return await getHistory(username, 10, lastKey);
}
