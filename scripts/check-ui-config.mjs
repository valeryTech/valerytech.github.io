import { readUiConfig, validateUiConfig } from "./ui-config.mjs";

try {
  validateUiConfig(readUiConfig());
  console.log("UI, callout, and engagement configuration is valid.");
} catch (error) {
  console.error(`UI configuration: ${error.message}`);
  process.exitCode = 1;
}
