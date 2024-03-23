interface COLLECTED_PUBLICATION_TYPE {
  type: "PUBLICATION_COLLECTED";
  collectorProfileId: string;
  serverPubId: string;
}

interface NEW_FOLLOWER_TYPE {
  type: "PROFILE_FOLLOWED";
  followerProfileId: string;
}

export type ALERT_TYPES = COLLECTED_PUBLICATION_TYPE | NEW_FOLLOWER_TYPE;
