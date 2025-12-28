import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const isLocal = process.env.NEXT_PUBLIC_IS_LOCAL;
const config = {
  region: "us-east-1",
  endpoint: isLocal ? "http://localhost:8000" : undefined,
  credentials: {
    accessKeyId: "fake",
    secretAccessKey: "fake",
  },
};

const client = new DynamoDBClient(config);
export const db = DynamoDBDocumentClient.from(client);
export const TABLE_NAME = "Ledger";
