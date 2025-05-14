"use client";
import React, { memo } from "react";
import LiveChatWidget from "../../../components/LiveChat/LiveChatWidget";

const LiveChatWidgetPage = ({ params }: { params: any }) => {
  const { accountAddress } = React.use<{
    accountAddress: string;
  }>(params);
  if (!accountAddress) return null;
  return (
    <div>
      <LiveChatWidget accountAddress={accountAddress} />
    </div>
  );
};

export default memo(LiveChatWidgetPage);
