import { db, TABLE_NAME } from "./dynamodb";
import { PutCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

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

export interface Transaction {
  id: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  counterparty: string;
  date: string;
}


export interface HistoryResponse {
  transactions: Transaction[];
  lastKey?: Record<string, any>;
}


export const getHistory = async (
  username: string,
  limit: number = 10,
  startKey?: Record<string, any>
): Promise<HistoryResponse> => {
  const pk = `ACCT#${username}`;
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "PK= :pk AND begins_with(SK,:prefix)",
    ExpressionAttributeValues: {
      ":pk": pk,
      ":prefix": "TX#",
    },
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: startKey,
  });
  const response = await db.send(command);
  const transactions = (response.Items || []).map((item) => ({
    id: item.TransactionId,
    amount: item.Amount,
    type: (item.Amount > 0 ? "CREDIT" : "DEBIT") as "CREDIT" | "DEBIT",
    counterparty: item.Counterparty.replace("ACCT#", ""),
    date: item.SK.replace("TX#", "").split("T")[0],
  }));
  return {
    transactions: transactions,
    lastKey: response.LastEvaluatedKey,
  };
};
