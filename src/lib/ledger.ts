import { db, TABLE_NAME } from "./dynamodb";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

export interface UserProfile {
  username: string;
  name: string;
  intialBalance: number;
}

export const createUser = async (user: UserProfile) => {
  const pk = `ACCT#${user.username}`;
  await db.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: pk,
        SK: "METADATA",
        Type: "ACC",
        Balance: user.intialBalance,
        Currency: "INR",
        Version: 0,
        Name: user.name,
        CreatedAt: new Date().toISOString(),
      },
      ConditionExpression: "attribute_not_exists(PK)",
    })
  );
  console.log(
    `created User: ${user.username} with balance ${user.intialBalance}`
  );
};
export const getBalance = async (username: string) => {
  const result = await db.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `ACCT#${username}`,
        SK: "METADATA",
      },
    })
  );
  return result.Item || null;
};
