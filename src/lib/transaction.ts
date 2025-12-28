import { db, TABLE_NAME } from "./dynamodb";
import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

export const transferFunds = async ({
  fromUser,
  toUser,
  amount,
  currency = "INR",
  currentVersion,
  idempotencyKey
}: {
  fromUser: string;
  toUser: string;
  amount: number;
  currency?: string;
  currentVersion:number
  idempotencyKey:string
}) => {
  const transctionId = uuidv4();
  const timestamp = new Date().toISOString();
  const date = timestamp.split("T")[0];
  const time = timestamp.split("T")[1];
  const txSortKey = `TX#${timestamp}`;
  try {
    const command = new TransactWriteCommand({
      TransactItems: [
        {
          Update: {
            TableName: TABLE_NAME,
            Key: { PK: `ACCT#${fromUser}`, SK: "METADATA" },
            UpdateExpression:
              "SET Balance = Balance - :amount, Version = Version + :inc",
            ConditionExpression: "Balance >= :amount AND Version = :currVer",
            ExpressionAttributeValues: {
              ":amount": amount,
              ":inc": 1,
              ":currVer":currentVersion
            },
          },
        },
        {
          Update: {
            TableName: TABLE_NAME,
            Key: { PK: `ACCT#${toUser}`, SK: "METADATA" },
            UpdateExpression:
              "SET Balance= Balance + :amount,Version = Version + :inc",
            ConditionExpression: "attribute_exists(PK)",
            ExpressionAttributeValues: {
              ":amount": amount,
              ":inc": 1,
            },
          },
        },
        {
          Put: {
            TableName: TABLE_NAME,
            Item: {
              PK: `ACCT#${fromUser}`,
              SK: txSortKey,
              Type: "ENTRY",
              Amount: -amount,
              Currency: currency,
              TransactionId: transctionId,
              Counterparty: `ACCT#${toUser}`,
              GSI1PK: `DATE#${date}`,
              GSI1SK: `TIME#${time}`,
            },
          },
        },
        {
          Put: {
            TableName: TABLE_NAME,
            Item: {
              PK: `ACCT#${toUser}`,
              SK: txSortKey,
              Type: "ENTRY",
              Amount: amount,
              Currency: currency,
              TransactionId: transctionId,
              Counterparty: `ACCT#${fromUser}`,
              GSI1PK: `DATE#${date}`,
              GSI1SK: `TIME#${time}`,
            },
          },
        },
        {
          Put:{
            TableName:TABLE_NAME,
            Item:{
              PK:`IDEM#${idempotencyKey}`,
              SK:"METADATA",
              CreatedAt:new Date().toISOString(),
              TTL:Math.floor(Date.now()/1000)+86400,
            },
            ConditionExpression:"attribute_not_exists(PK)"
          }
        }
      ],
    });
    await db.send(command);
    console.log(`Transfer Successful${transctionId}`);
    return { success: true, transctionId };
  } catch (error: any) {
    if (error.name === "TransactionCanceledException") {
      const reasons = error.CancellationReasons;
      if (reasons[4]?.Code === "ConditionalCheckFailed") {
         console.warn(`Idempotency Hit: Key ${idempotencyKey} already used.`);
         throw new Error("IDEMPOTENCY_HIT"); 
      }
      if (reasons[0].Code === "ConditionalCheckFailed") {
        console.log(`Transfer Failed :${fromUser} has insufficient funds.`);
        throw new Error("INSUFFICIENT_FUNDS");
      }
    }
    console.log("sytem error:",error);
    throw error;
  }
};
