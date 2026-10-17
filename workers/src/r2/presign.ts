import { AwsClient } from "aws4fetch";
import type { Env } from "../types/env";

export async function presignGetUrl(env: Env, objectKey: string, expiresSec: number) {
  const client = new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    service: "s3",
    region: "auto",
  });

  const url = new URL(
    `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.R2_BUCKET_NAME}/${objectKey}`,
  );
  url.searchParams.set("X-Amz-Expires", String(expiresSec));

  const signed = await client.sign(new Request(url, { method: "GET" }), {
    aws: { signQuery: true },
  });
  return signed.url;
}
