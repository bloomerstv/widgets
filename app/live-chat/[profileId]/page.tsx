"use client";
import React, { memo } from "react";
import LiveChatWidget from "../../../components/LiveChat/LiveChatWidget";

const LiveChatWidgetPage = ({ params }: { params: any }) => {
  const { profileId } = React.use<{
    profileId: string;
  }>(params);
  if (!profileId) return null;
  return (
    <div>
      <LiveChatWidget profileId={profileId} />
    </div>
  );
};

export default memo(LiveChatWidgetPage);
