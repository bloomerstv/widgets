import { LensClient, development, production } from "@lens-protocol/client";
import { isMainnet } from "./config";

export const lensClient = new LensClient({
  environment: isMainnet ? production : development,
});
