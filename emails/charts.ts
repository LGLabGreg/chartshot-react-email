import { Charts, type ChartSpec } from "@lglab/chartshot";

const secretKey = process.env.CHARTSHOT_SECRET_KEY;
const publicId = process.env.CHARTSHOT_PUBLIC_ID;

if (Boolean(secretKey) !== Boolean(publicId)) {
  console.warn(
    "Chartshot: set both CHARTSHOT_SECRET_KEY and CHARTSHOT_PUBLIC_ID to sign chart URLs. Using keyless URLs.",
  );
}

/**
 * Signs chart URLs when a key is set. Signed URLs need Chartshot Pro and up: with a Free or wrong
 * key, each chart draws an error image that says why. Without a key, emails use keyless URLs.
 */
export const charts = secretKey && publicId ? new Charts({ secretKey, publicId }) : null;

/** A chart URL that needs no account. Keyless charts carry a small Chartshot badge. */
export function keylessUrl(spec: ChartSpec): string {
  const c = Buffer.from(JSON.stringify(spec)).toString("base64url");
  return `https://api.chartshot.dev/v1/chart?c=${c}`;
}
