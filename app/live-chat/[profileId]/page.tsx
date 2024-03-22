"use client";
import React, { memo } from "react";
import LiveChatWidget from "../../../components/LiveChat/LiveChatWidget";

const LiveChatWidgetPage = ({
  params,
}: {
  params: {
    profileId: string;
  };
}) => {
  if (!params.profileId) return null;
  console.log("LiveChatWidgetPage rendered"); // Add this line
  return (
    <div>
      <LiveChatWidget profileId={params.profileId} />
    </div>
  );
};

export default memo(LiveChatWidgetPage);
