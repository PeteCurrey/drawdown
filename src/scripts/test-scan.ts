import { runSignalScan } from "../lib/signal-engine";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  console.log("Starting signal scan test from workspace...");
  try {
    const results = await runSignalScan();
    console.log("Scan succeeded! Results:", results);
  } catch (error) {
    console.error("Scan failed with error:", error);
  }
}

main().catch(console.error);
