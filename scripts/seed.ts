import { createUser } from "../src/lib/ledger";

const main = async () => {
  try {
    await createUser({
      username: "Alice",
      name: "Alice0132",
      intialBalance: 1000,
    });
    await createUser({
      username: "Bob",
      name: "Bob123",
      intialBalance: 500,
    });
    console.log("Database seeded successfully");
  } catch (error) {
    console.log("seeding failded", error);
  }
};
main();
