import { Account } from "@lens-protocol/client"
import { AVATAR_TR, ZERO_ADDRESS } from "./config"
import getStampFyiURL from "./getStampFyiURL"
import imageKit from "./imageKit"
import sanitizeDStorageUrl from "./sanitizeDStorageUrl"

/**
 * Returns the avatar image URL for a given profile.
 *
 * @param profile The profile object.
 * @param namedTransform The named transform to use.
 * @returns The avatar image URL.
 */
const getAvatar = (account: Account, namedTransform = AVATAR_TR): string => {
  const avatarUrl =
    account?.metadata?.picture ?? getStampFyiURL(account?.owner ?? ZERO_ADDRESS)

  console.log("avatarUrl", avatarUrl)

  return imageKit(sanitizeDStorageUrl(avatarUrl), namedTransform)
}

export default getAvatar
