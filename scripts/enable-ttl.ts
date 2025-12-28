import {
  DynamoDBClient,
  UpdateTimeToLiveCommand,
} from "@aws-sdk/client-dynamodb";

const isLocal = true;
const config = {
  region: "us-east-1",
  endpoint: isLocal ? "http://localhost:8000" : undefined,
  credentials: {
    accessKeyId: "fake",
    secretAccessKey: "fake",
  },
};

const client = new DynamoDBClient(config);

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
