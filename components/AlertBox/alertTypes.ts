interface COLLECTED_POST_TYPE {
  type: "POST_COLLECTED"
  collectorAccountAddress: string
  postId: string
}

interface NEW_FOLLOWER_TYPE {
  type: "ACCOUNT_FOLLOWED"
  followerAccountAddress: string
}

export type ALERT_TYPES = COLLECTED_POST_TYPE | NEW_FOLLOWER_TYPE
