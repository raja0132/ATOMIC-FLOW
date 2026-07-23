import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// const isLocal = process.env.NEXT_PUBLIC_IS_LOCAL || true;
const config = {
  // region: process.env.AWS_REGION,
};

const client = new DynamoDBClient(config);
export const db = DynamoDBDocumentClient.from(client);
export const TABLE_NAME = "Ledger";
