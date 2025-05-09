import { PublicClient, mainnet, testnet } from "@lens-protocol/client"
import { isMainnet } from "./config"

export const lensClient = PublicClient.create({
  environment: isMainnet ? mainnet : testnet,
  origin: "https://bloomers.tv",
})
