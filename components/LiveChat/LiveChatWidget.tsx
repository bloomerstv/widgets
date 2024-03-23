import React, { memo, useEffect, useState } from "react";
import { LIVE_CHAT_WEB_SOCKET_URL } from "../../utils/config";
import { io } from "socket.io-client";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Markup from "../Lexical/Markup";

interface MessageType {
  content: string;
  avatarUrl: string;
  handle: string;
  id: string;
}

const DUMMY_MESSAGES: MessageType[] = [
  {
    id: "t5vj8xybw",
    handle: "kontak",
    avatarUrl:
      "https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/ef7d15b15d35019de299a98588b181ceceb754b197ef26e05f0f4062c1d2bd9e.gif",
    content: "GM, GM 🌞",
  },
  {
    id: "t5vj8xybe",
    handle: "mycaleum",
    avatarUrl:
      "https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/5d45fe67e4b263ed997e4037318e4e8e46724c034150d8151120ab7935ba996f.gif",
    content: "GM !!!!",
  },
  {
    id: "t5vj8xybx",
    handle: "kontak",
    avatarUrl:
      "https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/ef7d15b15d35019de299a98588b181ceceb754b197ef26e05f0f4062c1d2bd9e.gif",
    content: "Let's play some COD",
  },
  {
    id: "t5vj8xyjx",
    handle: "asamisscream",
    avatarUrl:
      "https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/27e999df6646b28db7b4496179c7e33a18350ff3bb301f2edf3bbf6daa83d9b0.png",
    content: "おはよう 🌅",
  },
  {
    id: "t5vj8xalx",
    handle: "b0gie",
    avatarUrl:
      "https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/4a9727e63860cc2b4d8b347016ec19484b61f9922db7235f98e49f557818d72e.webp",
    content: "Will be there in 5 minutes 🚗",
  },
  {
    id: "t5vj8xglx",
    handle: "b0gie",
    avatarUrl:
      "https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/4a9727e63860cc2b4d8b347016ec19484b61f9922db7235f98e49f557818d72e.webp",
    content: "Gonna rap while playing COD, LFG!",
  },
];

const LiveChatWidget = ({ profileId }: { profileId: string }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  const searchParams = useSearchParams();
  const emulate = searchParams.get("emulate");
  const limit = Number(searchParams.get("limit")) || 5;

  console.log("limit", limit);

  useEffect(() => {
    if (emulate) {
      const handleEmulate = async () => {
        // show dummy chat
        // add one message from list every 2 seconds

        for (const message of DUMMY_MESSAGES) {
          setMessages((prev) => {
            return [...prev, message].slice(-limit);
          });
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // remove all messages one by one from top every 1 second

        for (let i = 0; i < DUMMY_MESSAGES.length; i++) {
          setMessages((prev) => {
            return prev.slice(1);
          });
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      };

      handleEmulate();
    }
  }, [emulate]);

  useEffect(() => {
    // const listenToSocket = async () => {
    // const authorToken = await getAccessToken()
    const newSocket = io(LIVE_CHAT_WEB_SOCKET_URL, {
      // auth: {
      //   token: authorToken
      // },
      // withCredentials: true
    });

    newSocket.on("connect", () => {
      setTimeout(() => {
        newSocket.emit("join", profileId);
        // if (!isSocketWithAuthToken && authorToken) {
        //   setIsSocketWithAuthToken(true)
        // }
        // @ts-ignore
        // setSocket(newSocket);
      }, 1000); // Wait for 1 second before joining the room
    });

    newSocket.on("message", (receivedData) => {
      const {
        profileId: chatProfileId,
        content,
        avatarUrl,
        handle,
        id,
      } = receivedData;

      if (chatProfileId === profileId && handle !== "System") {
        // run pop up sound

        setMessages((prev) => {
          return [
            ...prev,
            {
              content,
              avatarUrl,
              handle,
              id,
            },
          ].slice(-limit);
        });
      }
    });
    // }

    // listenToSocket()

    return () => {
      if (newSocket) {
        newSocket?.disconnect();
        newSocket?.close();
        newSocket?.removeAllListeners();
      }
    };
  }, []);

  const profileAnimation = {
    initial: { scale: 0, originX: 0, originY: 0 },
    animate: { scale: 1, transition: { duration: 0.2 } },
    exit: { scale: 0, originX: 0, originY: 0, transition: { duration: 0.2 } },
  };

  const contentAnimation = {
    initial: { scale: 0, originX: 0, originY: 0 },
    animate: { scale: 1, transition: { duration: 0.2, delay: 0.2 } },
    exit: {
      scale: 0,
      originX: 0,
      originY: 0,
      transition: { duration: 0.2, delay: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {messages.map((message) => (
        <motion.div
          layout="position"
          key={message.id}
          className="relative mb-2"
        >
          {/* profile div */}
          <motion.div
            variants={profileAnimation}
            key={message.id}
            initial="initial"
            animate="animate"
            exit="exit"
            className="rounded-md z-50 bg-brand text-md text-white flex flex-row items-center gap-x-1 p-1.5 font-bold text-sm absolute top-0 left-0"
          >
            <img
              src={message.avatarUrl}
              alt="avatar"
              className="w-4 h-4 rounded-full"
            />
            <span
              style={{
                lineHeight: 1,
              }}
            >
              {message.handle}
            </span>
          </motion.div>

          {/* content div */}
          <div className="pt-3">
            <motion.div
              variants={contentAnimation}
              key={message.id}
              initial="initial"
              animate="animate"
              exit="exit"
              className="px-2 pb-1 w-fit min-w-[80px] bg-s-bg ml-3 pt-4 font-semibold text-md rounded-lg"
            >
              <Markup>{message.content}</Markup>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default memo(LiveChatWidget);
