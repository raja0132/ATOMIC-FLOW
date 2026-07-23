import { createUser } from "@/lib/ledger";

const seedUser = async () => {
  let promises = [];
  try {
    for (let i = 101; i < 1000; i++) {
      promises.push(
        createUser({
          username: `User_${i}`,
          name: `User_${i}`,
          intialBalance: 10000000,
        })
      );
    }
    await Promise.all(promises);
    console.log("success seeded 100 users");
  } catch (error: any) {
    console.log(error);
  }
};
seedUser();
