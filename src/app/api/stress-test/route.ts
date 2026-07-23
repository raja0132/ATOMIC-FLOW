import { NextRequest, NextResponse } from "next/server";
import { transferFunds } from "@/lib/transaction";
import { getBalance } from "@/lib/ledger";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  
  if (secret != process.env.STRESS_TEST_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fromUser, toUser, amount, idempotencyKey, forceVersion } = body;

    let currentVersion = forceVersion;
    if (currentVersion == undefined) {
      const senderData = await getBalance(fromUser);
      if (!senderData) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      currentVersion = senderData.Version;
    }

    const result = await transferFunds({
      fromUser,
      toUser,
      amount,
      currentVersion,
      idempotencyKey,
    });

    return NextResponse.json(result);

  } catch (error: any) {
    if (error.name === "TransactionCanceledException") {
      return NextResponse.json(
        { error: "Transaction Blocked by Concurrency Control" },
        { status: 409 }
      );
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}