import "dotenv/config"
import {
  DynamoDBClient,
  UpdateTimeToLiveCommand,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const enableTTL = async () => {
  const command = new UpdateTimeToLiveCommand({
    TableName: "Ledger",
    TimeToLiveSpecification: {
      Enabled: true,
      AttributeName: "TTL",
    },
  });
  try {
    const response = await client.send(command);
    console.log("TTL Enabled successfully", response.TimeToLiveSpecification);
  } catch (err) {
    console.log("error enabling TTL");
  }
};
enableTTL();
