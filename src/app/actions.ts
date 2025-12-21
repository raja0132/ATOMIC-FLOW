"use server";
import { getBalance } from "@/lib/ledger";
import { transferFunds } from "@/lib/transaction";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { transactionState } from "./types";

export async function getUserData(username: string) {
  const data = await getBalance(username);
  if (data === null) return null;
  return {
    name: data.Name,
    balance: (data.Balance / 100).toFixed(2),
    username: username,
  };
}

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  redirect(`/dashboard?user=${username}`);
}
export async function transferAction(prevState:transactionState, formData: FormData) : Promise<transactionState> {
  const fromUser = formData.get("fromUser") as string;
  const toUser = formData.get("toUser") as string;
  const amountRaw = formData.get("amount") as string;
  const decimalAmount = parseFloat(amountRaw);
  const amountInpaise = Math.round(decimalAmount * 100);
  if (!fromUser || !toUser || !amountInpaise || amountInpaise <= 0) {
    return { success:false,message:"Failed to add transaction",error: "Invalid input data" };
  }
  try {
    await transferFunds({
      fromUser,
      toUser,
      amount: amountInpaise,
    });
    revalidatePath("/dashboard");
    return { success: true, message: `sent ${amountRaw} to ${toUser}` ,error:null};
  } catch (error: any) {
    if (error.message === "INSUFFICIENT_FUNDS") {
      return {  success: false,message:"Failed: You don't have enough money",error: "Failed: You don't have enough money"};
    }
    return {  success: false,message:"System Error: Transaction failed",error: "System Error: Transaction failed" };
  }
}
