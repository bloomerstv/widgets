import React, { memo, useEffect, useState } from "react"
import { LIVE_CHAT_WEB_SOCKET_URL } from "../../utils/config"
import { io } from "socket.io-client"
import { AnimatePresence, motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import Markup from "../Lexical/Markup"
import { ContentType, Message, MessageType } from "./LiveChatType"

const DUMMY_MESSAGES: Message[] = [
  {
    id: "t5vj8xybw",
    handle: "kontak",
    type: MessageType.Account,
    accountAddress: "accountAddress",
    contentType: ContentType.Comment,
    avatarUrl:
      "https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/ef7d15b15d35019de299a98588b181ceceb754b197ef26e05f0f4062c1d2bd9e.gif",
    content: "GM, GM 🌞",
  },
  {
    id: "t5vj8xybe",
    handle: "mycaleum",
    type: MessageType.Account,
    accountAddress: "accountAddress",
    contentType: ContentType.Comment,
    avatarUrl:
      "https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/5d45fe67e4b263ed997e4037318e4e8e46724c034150d8151120ab7935ba996f.gif",
    content: "GM !!!!",
  },
  {
    id: "t5vj8xybx",
    handle: "kontak",
    type: MessageType.Account,
    accountAddress: "accountAddress",
    contentType: ContentType.Comment,

    avatarUrl:
      "https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/ef7d15b15d35019de299a98588b181ceceb754b197ef26e05f0f4062c1d2bd9e.gif",
    content: "Let's play some COD",
  },
  {
    id: "t5vj8xyjx",
    handle: "asamisscream",
    type: MessageType.Account,
    accountAddress: "accountAddress",
    contentType: ContentType.Comment,

    avatarUrl:
      "https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/27e999df6646b28db7b4496179c7e33a18350ff3bb301f2edf3bbf6daa83d9b0.png",
    content: "おはよう 🌅",
  },
  {
    id: "t5vj8xalx",
    handle: "b0gie",
    type: MessageType.Account,
    accountAddress: "accountAddress",
    contentType: ContentType.Comment,

    avatarUrl:
      "https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/4a9727e63860cc2b4d8b347016ec19484b61f9922db7235f98e49f557818d72e.webp",
    content: "Will be there in 5 minutes 🚗",
  },
  {
    id: "t5vj8xglx",
    handle: "b0gie",
    type: MessageType.Account,
    accountAddress: "accountAddress",
    contentType: ContentType.Comment,

    avatarUrl:
      "https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/4a9727e63860cc2b4d8b347016ec19484b61f9922db7235f98e49f557818d72e.webp",
    content: "Gonna rap while playing COD, LFG!",
  },
]

const LiveChatWidget = ({ accountAddress }: { accountAddress: string }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [uniqueMessages, setUniqueMessages] = useState<Message[]>([])

  const searchParams = useSearchParams()
  const emulate = searchParams.get("emulate")
  const limit = Number(searchParams.get("limit")) || 5
  const autoRemoveChatInterval = searchParams.get("autoRemoveChatInterval")
    ? Number(searchParams.get("autoRemoveChatInterval")) || 0
    : 5

  // Filter out duplicate messages by ID
  useEffect(() => {
    const seen = new Set()
    const filteredArr = messages.filter((el) => {
      if (
        el.type === MessageType.Account &&
        el.contentType !== ContentType.Comment
      ) {
        return false
      }
      const duplicate = seen.has(el.id)
      seen.add(el.id)
      return !duplicate
    })
    setUniqueMessages(filteredArr)
  }, [messages])

  useEffect(() => {
    if (emulate) {
      const handleEmulate = async () => {
        // show dummy chat
        // add one message from list every 2 seconds

        for (const message of DUMMY_MESSAGES) {
          setMessages((prev) => {
            return [...prev, message].slice(-limit)
          })
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }

        // remove all messages one by one from top every 1 second
        // for (let i = 0; i < DUMMY_MESSAGES.length; i++) {
        //   setMessages((prev) => {
        //     return prev.slice(1);
        //   });
        //   await new Promise((resolve) => setTimeout(resolve, 1000));
        // }
      }

      handleEmulate()
    }
  }, [emulate])

  useEffect(() => {
    // const listenToSocket = async () => {
    // const authorToken = await getAccessToken()
    const newSocket = io(LIVE_CHAT_WEB_SOCKET_URL, {
      // auth: {
      //   token: authorToken
      // },
      // withCredentials: true
    })

    newSocket.on("connect", () => {
      // join the room with the accountAddress of the streamer to listen to messages
      newSocket.emit("join", accountAddress)
    })

    // listen to messages of the chat
    newSocket.on("message", (receivedData: Message) => {
      if (
        receivedData.type === "System" ||
        receivedData.contentType !== ContentType.Comment
      )
        return
      setMessages((prev: Message[]) => {
        return [...prev, receivedData].slice(-limit)
      })
    })

    // when streamer bans a profile, listed to this event to remove all the messages from the banned profile on the streamer chat to update the real-time
    newSocket.on("remove-messages", (accountAddress: string) => {
      setMessages((prev) =>
        prev.filter((msg) => {
          if (msg.type === "System") return true

          return msg.authorAccountAddress !== accountAddress
        })
      )
    })
    // }

    // listenToSocket()

    return () => {
      if (newSocket) {
        newSocket?.disconnect()
        newSocket?.close()
        newSocket?.removeAllListeners()
      }
    }
  }, [])

  useEffect(() => {
    if (!autoRemoveChatInterval) return
    if (autoRemoveChatInterval) {
      const intervalId = setInterval(() => {
        setMessages((prev) => {
          if (prev.length > 0) {
            return prev.slice(1)
          }
          return prev
        })
      }, autoRemoveChatInterval * 1000)

      if (messages.length === 0) {
        clearInterval(intervalId)
      }
      return () => clearInterval(intervalId)
    }
  }, [autoRemoveChatInterval, messages])

  const profileAnimation = {
    initial: { scale: 0, originX: 0, originY: 0 },
    animate: { scale: 1, transition: { duration: 0.2 } },
    exit: { scale: 0, originX: 0, originY: 0, transition: { duration: 0.2 } },
  }

  const contentAnimation = {
    initial: { scale: 0, originX: 0, originY: 0 },
    animate: { scale: 1, transition: { duration: 0.2, delay: 0.2 } },
    exit: {
      scale: 0,
      originX: 0,
      originY: 0,
      transition: { duration: 0.2, delay: 0.2 },
    },
  }

  return (
    <AnimatePresence>
      {uniqueMessages.map((message) => {
        // if you are want to show system messages you can show them by comparing the type like this,
        // for this widget we are only showing profile messages
        if (message.type === "System") return null

        return (
          <motion.div
            layout="position"
            key={message.id}
            className="relative m-1 chat-container"
          >
            {/* profile div */}
            {message.amount ? (
              <motion.div
                variants={profileAnimation}
                key={message.id}
                initial="initial"
                animate="animate"
                exit="exit"
                className="rounded-full profile-container z-50 bg-brand text-md text-white flex flex-row items-center gap-x-1 py-1 px-2.5 font-bold text-sm absolute top-0 left-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={message.avatarUrl}
                  alt="avatar"
                  className="w-7 h-7 rounded-full avatar"
                />

                <div className="flex flex-col items-start space-y-1 ml-1">
                  <span
                    style={{
                      lineHeight: 1,
                    }}
                    className="handle"
                  >
                    {message.handle}{" "}
                    {message.accountAddress === message.authorAccountAddress &&
                      "🎙️"}
                  </span>

                  <span className="text-xs pr-2 super-chat">
                    {message.amount} {message.currencySymbol}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={profileAnimation}
                key={message.id}
                initial="initial"
                animate="animate"
                exit="exit"
                className="rounded-full profile-container z-50 bg-brand text-md text-white flex flex-row items-center gap-x-1 py-1.5 px-2.5 font-bold text-sm absolute top-0 left-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={message.avatarUrl}
                  alt="avatar"
                  className="w-4 h-4 rounded-full avatar"
                />
                <span
                  style={{
                    lineHeight: 1,
                  }}
                  className="handle"
                >
                  {message.handle}{" "}
                  {message.accountAddress === message.authorAccountAddress &&
                    "🎙️"}
                </span>
              </motion.div>
            )}

            {/* content div */}
            <div className={message.amount ? "pt-8" : "pt-3"}>
              <motion.div
                variants={contentAnimation}
                key={message.id}
                initial="initial"
                animate="animate"
                exit="exit"
                className="px-2 message-container pb-1 w-fit min-w-[80px] bg-white/80 ml-3 pt-4 font-semibold text-md rounded-lg"
              >
                <Markup className="message">{message.content}</Markup>
              </motion.div>
            </div>
          </motion.div>
        )
      })}
    </AnimatePresence>
  )
}

export default memo(LiveChatWidget)
