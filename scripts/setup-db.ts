import "dotenv/config"
import {
  DynamoDBClient,
  CreateTableCommand,
  DeleteTableCommand,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});
const TABLE_NAME = "Ledger";
const setup = async () => {
  try {
    await client.send(new DeleteTableCommand({ TableName: TABLE_NAME }));
    console.log("deleted old table");
  } catch (e) {
    console.log("Table does not exist");
  }
  const command = new CreateTableCommand({
    TableName: TABLE_NAME,
    KeySchema: [
      { AttributeName: "PK", KeyType: "HASH" },
      { AttributeName: "SK", KeyType: "RANGE" },
    ],
    AttributeDefinitions: [
      { AttributeName: "PK", AttributeType: "S" },
      { AttributeName: "SK", AttributeType: "S" },
      { AttributeName: "GSI1PK", AttributeType: "S" },
      { AttributeName: "GSI1SK", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "GSI1",
        KeySchema: [
          { AttributeName: "GSI1PK", KeyType: "HASH" },
          { AttributeName: "GSI1SK", KeyType: "RANGE" },
        ],
        Projection: {
          ProjectionType: "ALL",
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  });
  try {
    await client.send(command);
    console.log("Table is created successfully");
  } catch (err) {
    console.error("error", err);
  }
};

setup();
