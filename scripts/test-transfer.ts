import { transferFunds } from "../src/lib/transaction";
import { getBalance } from "@/lib/ledger";

const main = async () => {
    console.log("before transfer funds");
    console.log("Alice" ,await getBalance("Alice"));
    console.log("Bob" ,await getBalance("Bob"));

    console.log("sending 50 INR to alice to bob");
    try
    {
        await transferFunds(
            {
                fromUser:"Alice",
                toUser:"Bob",
                amount:500
            }
        );
    }
    catch(e : any)
    {
        console.log(e);
    }
    console.log("After transfer funds");
    console.log("Alice" ,await getBalance("Alice"));
    console.log("Bob" ,await getBalance("Bob"));

};
main();
