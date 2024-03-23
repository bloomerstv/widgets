import React, { use, useEffect, useState } from "react";
import { NODE_API_URL } from "../../utils/config";
import { useSearchParams } from "next/navigation";
import { ALERT_TYPES } from "./alertTypes";
import { lensClient } from "../../utils/lensClient";
import { AnimatePresence, motion } from "framer-motion";
import { stringToLength } from "../../utils/helpers";
import getAvatar from "../../utils/getAvatar";
import { OpenActionModuleType } from "@lens-protocol/client";
import Markup from "../Lexical/Markup";

interface ShowAlertType {
  type: "PUBLICATION_COLLECTED" | "PROFILE_FOLLOWED";
  handle?: string;
  avatar?: string;
  publicationTitle?: string;
  collectCurrency?: string;
  collectAmount?: string;
}

const DUMMY_ALERTS: ShowAlertType[] = [
  {
    type: "PROFILE_FOLLOWED",
    handle: "kontak",
    avatar:
      "https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/ef7d15b15d35019de299a98588b181ceceb754b197ef26e05f0f4062c1d2bd9e.gif",
  },
  {
    type: "PUBLICATION_COLLECTED",
    handle: "b0gie",
    avatar:
      "https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/4a9727e63860cc2b4d8b347016ec19484b61f9922db7235f98e49f557818d72e.webp",
    publicationTitle: "Saturday Fortnite Live",
    collectCurrency: "WMATIC",
    collectAmount: "5",
  },
];

const AlertBoxWidget = ({ profileId }: { profileId: string }) => {
  const searchParams = useSearchParams();
  const emulate = searchParams.get("emulate") === "true";
  const [collectAlerts, setCollectAlerts] = React.useState(true);
  const [newFollowersAlerts, setNewFollowersAlerts] = React.useState(true);

  const [currentAlert, setCurrentAlert] = useState<ShowAlertType | null>(null);
  const [alertQueue, setAlertQueue] = useState<ShowAlertType[]>([]);

  const hanldeEmulate = async () => {
    addAlert(DUMMY_ALERTS[0]);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    addAlert(DUMMY_ALERTS[1]);
  };

  useEffect(() => {
    if (!emulate) return;
    hanldeEmulate();
  }, [emulate]);

  // Function to add a new alert
  const addAlert = (newAlert: ShowAlertType) => {
    if (currentAlert) {
      // If there's already an alert, add the new alert to the queue
      setAlertQueue((prevQueue) => [...prevQueue, newAlert]);
    } else {
      // If there's no alert, show the new alert
      setCurrentAlert(newAlert);
    }
  };

  // When the current alert changes, set a timeout to remove it after 5 seconds
  useEffect(() => {
    if (currentAlert) {
      const timeout = setTimeout(() => {
        setCurrentAlert(null);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [currentAlert]);

  // When the current alert is removed, show the next alert from the queue
  useEffect(() => {
    if (!currentAlert && alertQueue.length > 0) {
      setCurrentAlert(alertQueue[0]);
      setAlertQueue((prevQueue) => prevQueue.slice(1));
    }
  }, [currentAlert, alertQueue]);

  useEffect(() => {
    const newCollects = searchParams.get("newCollects") === "true";
    const newFollowers = searchParams.get("newFollowers") === "true";
    setCollectAlerts(newCollects);
    setNewFollowersAlerts(newFollowers);
  }, [searchParams]);

  const handleCollectPublication = async (
    collectorProfileId: string,
    serverPubId: string
  ) => {
    const profile = await lensClient.profile.fetch({
      forProfileId: collectorProfileId,
    });

    const publication = await lensClient.publication.fetch({
      forId: serverPubId,
    });

    // @ts-ignore
    const collectModule = publication?.openActionModules?.find(
      (module: any) =>
        module.type === OpenActionModuleType.SimpleCollectOpenActionModule ||
        module.type ===
          OpenActionModuleType.MultirecipientFeeCollectOpenActionModule
    );

    // @ts-ignore
    const amount = collectModule?.amount;
    const value = amount?.value;
    const symbol = amount?.asset?.symbol;

    addAlert({
      type: "PUBLICATION_COLLECTED",
      handle: profile?.handle?.localName,
      avatar: getAvatar(profile),
      collectAmount: value,
      collectCurrency: symbol,
      // @ts-ignore
      publicationTitle: publication?.metadata?.content,
    });
  };

  const handleNewFollower = async (followerProfileId: string) => {
    const profile = await lensClient.profile.fetch({
      forProfileId: followerProfileId,
    });

    addAlert({
      type: "PROFILE_FOLLOWED",
      handle: profile?.handle?.localName,
      avatar: getAvatar(profile),
    });
  };

  useEffect(() => {
    const newEventSource = new EventSource(
      `${NODE_API_URL}/alerts/${profileId}?newCollects=${collectAlerts}&newFollowers=${newFollowersAlerts}`
    );

    newEventSource.onmessage = (event) => {
      const eventData: ALERT_TYPES = JSON.parse(event.data);
      // Handle the received event data here
      if (eventData.type === "PUBLICATION_COLLECTED") {
        // handle and show collected alert
        handleCollectPublication(
          eventData.collectorProfileId,
          eventData.serverPubId
        );
      } else if (eventData.type === "PROFILE_FOLLOWED") {
        // handle and show new follower alert
        handleNewFollower(eventData.followerProfileId);
      }
    };

    newEventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      // Handle errors
    };

    return () => {
      newEventSource.close();
    };
  }, [collectAlerts, newFollowersAlerts]);

  return (
    <AnimatePresence>
      {currentAlert && (
        <motion.div
          key={`${currentAlert.type}-${Date.now()}`}
          className="mx-[15vw] flex flex-col items-center justify-center"
        >
          {/* profile image */}
          <motion.img
            style={{ transformOrigin: "bottom center" }}
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              transition: {
                duration: 0.5,
              },
            }}
            exit={{
              scale: 0,
              transition: {
                duration: 0.2,
              },
              opacity: 0,
            }}
            src={currentAlert.avatar}
            alt="profile"
            className="rounded-full w-[42vw] h-[42vw]"
          />
          {/* // text box */}
          <motion.div
            style={{ transformOrigin: "top center" }}
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              transition: {
                duration: 0.5,
              },
            }}
            exit={{
              scale: 0,
              transition: {
                duration: 0.2,
              },
              opacity: 0,
            }}
            className="z-50 max-w-[80vw] text-[3.5vw] -mt-[5vw] font-bold rounded-[2vw] text-white bg-brand p-[1vw]"
          >
            <Markup>
              {`${currentAlert.handle} ${
                currentAlert.type === "PUBLICATION_COLLECTED"
                  ? `collected your post \n${
                      currentAlert.publicationTitle
                        ? `"${stringToLength(
                            currentAlert.publicationTitle,
                            20
                          )}"`
                        : ""
                    } ${
                      currentAlert?.collectAmount &&
                      currentAlert?.collectCurrency
                        ? `for ${currentAlert.collectAmount} ${currentAlert.collectCurrency}`
                        : ""
                    }`
                  : "has started following you"
              }`}
            </Markup>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertBoxWidget;
