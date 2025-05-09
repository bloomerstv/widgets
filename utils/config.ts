export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const NODE_API_MODE =
  process.env.NEXT_PUBLIC_NODE_API_MODE ?? "production"

export const LOCAL_NODE_API_URL = "http://localhost:8000"
export const PRODUCTION_NODE_API_URL = "https://api.bloomers.tv"
// export const PRODUCTION_NODE_API_URL = 'https://bloomerstv-api.onrender.com'
export const DEVELOPMENT_NODE_API_URL =
  "https://bloomerstv-api-dev.onrender.com"

export const NODE_API_URL =
  NODE_API_MODE === "local"
    ? LOCAL_NODE_API_URL
    : NODE_API_MODE === "production"
    ? PRODUCTION_NODE_API_URL
    : DEVELOPMENT_NODE_API_URL

export const LIVE_CHAT_WEB_SOCKET_URL =
  NODE_API_MODE === "local"
    ? `ws://localhost:8000`
    : NODE_API_MODE === "production"
    ? `wss://api.bloomers.tv`
    : `wss://bloomerstv-api-dev.onrender.com`
export const isMainnet = NODE_API_MODE === "production"

export const LENS_MEDIA_SNAPSHOT_URL =
  "https://ik.imagekit.io/lens/media-snapshot"
export const ARWEAVE_GATEWAY = "https://arweave.net/"
export const IPFS_GATEWAY = "https://gw.ipfs-lens.dev/ipfs/"

export const AVATAR_TR = "tr:w-300,h-300"
