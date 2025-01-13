"use client";
import React from "react";
import AlertBoxWidget from "../../../components/AlertBox/AlertBoxWidget";

const AlexBoxPage = ({ params }: { params: any }) => {
  const { profileId } = React.use<{
    profileId: string;
  }>(params);
  if (!profileId) return null;
  return (
    <div>
      <AlertBoxWidget profileId={profileId} />
    </div>
  );
};

export default AlexBoxPage;
