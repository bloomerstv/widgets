export const NODE_API_MODE =
  process.env.NEXT_PUBLIC_NODE_API_MODE ?? "production";

export const LOCAL_NODE_API_URL = "http://localhost:8000";
export const PRODUCTION_NODE_API_URL = "https://api.bloomers.tv";
// export const PRODUCTION_NODE_API_URL = 'https://bloomerstv-api.onrender.com'
export const DEVELOPMENT_NODE_API_URL =
  "https://bloomerstv-api-dev.onrender.com";

export const NODE_API_URL =
  NODE_API_MODE === "local"
    ? LOCAL_NODE_API_URL
    : NODE_API_MODE === "production"
    ? PRODUCTION_NODE_API_URL
    : DEVELOPMENT_NODE_API_URL;

export const LIVE_CHAT_WEB_SOCKET_URL =
  NODE_API_MODE === "local"
    ? `ws://localhost:8000`
    : NODE_API_MODE === "production"
    ? `wss://api.bloomers.tv`
    : `wss://bloomerstv-api-dev.onrender.com`;
