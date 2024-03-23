"use client";
import React from "react";
import AlertBoxWidget from "../../../components/AlertBox/AlertBoxWidget";

const AlexBoxPage = ({
  params,
}: {
  params: {
    profileId: string;
  };
}) => {
  if (!params.profileId) return null;
  return (
    <div>
      <AlertBoxWidget profileId={params.profileId} />
    </div>
  );
};

export default AlexBoxPage;
