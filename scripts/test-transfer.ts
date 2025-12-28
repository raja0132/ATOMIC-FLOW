import { transferFunds } from "../src/lib/transaction";
import { getBalance } from "@/lib/ledger";
import { v4 as uuidv4 } from "uuid";

const main = async () => {
  console.log("before transfer funds");
  const aliceData = await getBalance("Alice");
  const bobData = await getBalance("Bob");
  console.log("Alice", aliceData);
  console.log("Bob", bobData);

  console.log("sending 5 INR to alice to bob");
  try {
    await transferFunds({
      fromUser: "Alice",
      toUser: "Bob",
      amount: 500,
      currentVersion: aliceData?.Version,
      idempotencyKey:uuidv4()
    });
  } catch (e: any) {
    console.log(e);
  }
  console.log("After transfer funds");
  console.log("Alice", await getBalance("Alice"));
  console.log("Bob", await getBalance("Bob"));
};
main();
