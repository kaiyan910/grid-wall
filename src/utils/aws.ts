import AWS from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import { v4 as uuid } from "uuid";

AWS.config.update({
  region: process.env.AWS_LOCATION,
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

export const uploadFile = async (base64: string): Promise<string> => {
  const buffer = Buffer.from(
    base64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const type = base64.split(";")[0].split("/")[1];
  const params: PutObjectRequest = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `${uuid()}.${type}`,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };
  const { Key } = await s3.upload(params).promise();

  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_LOCATION}.amazonaws.com/${Key}`;
};
