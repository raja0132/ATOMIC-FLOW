import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getBalance,createUser } from "./lib/ledger";

console.log("========== ENV CHECK ==========");
console.log("AUTH_SECRET:", process.env.AUTH_SECRET ? "FOUND" : "MISSING");
console.log("AUTH_GOOGLE_ID:", process.env.AUTH_GOOGLE_ID ? "FOUND" : "MISSING");
console.log("AUTH_GOOGLE_SECRET:", process.env.AUTH_GOOGLE_SECRET ? "FOUND" : "MISSING");
console.log(
  "AUTH variables:",
  Object.keys(process.env).filter((k) => k.startsWith("AUTH"))
);
console.log("===============================");


export const {handlers,signIn,signOut,auth}=NextAuth({
    trustHost : true,
    // secret: process.env.AUTH_SECRET,
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],
    callbacks:{
        async signIn({user}) {
            if(!user.email) return false;
            const existingUser=await getBalance(user.email);

            if(!existingUser)
            {
                console.log(`new user detected : ${user.email}`);
                await createUser({
                    username:user.email as string,
                    name:user.name || 'Anonymous',
                    intialBalance:100000
                }
                );
            }
            return true;
        },
        async session({session})
      {
         return session;
      }
    }
});