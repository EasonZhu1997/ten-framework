"use client"

import { useAppSelector, EMobileActiveTab } from "@/common"
import dynamic from "next/dynamic"

import Header from "@/components/Layout/Header"
import Action from "@/components/Layout/Action"
// import RTCCard from "@/components/Dynamic/RTCCard"
// import ChatCard from "@/components/Chat/ChatCard"
import AuthInitializer from "@/components/authInitializer"
import { cn } from "@/lib/utils"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "测试标题页",
  description:
    "TEN Agent is an open-source multimodal AI agent that can speak, see, and access a knowledge base(RAG).",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
  },
}

const DynamicRTCCard = dynamic(() => import("@/components/Dynamic/RTCCard"), {
  ssr: false,
})

const DynamicChatCard = dynamic(() => import("@/components/Chat/ChatCard"), {
  ssr: false,
})

export default function Home() {
  const mobileActiveTab = useAppSelector(
    (state) => state.global.mobileActiveTab,
  )

  return (
    <AuthInitializer>
      <div className="relative mx-auto flex h-full min-h-screen flex-col md:h-screen">
        <Header className="h-[60px]" />
        <Action className="h-[48px]" />
        <div className="mx-2 mb-2 flex h-full max-h-[calc(100vh-108px-24px)] flex-col md:flex-row md:gap-2">
          <DynamicRTCCard
            className={cn(
              "m-0 w-full rounded-b-lg bg-[#181a1d] md:w-[480px] md:rounded-lg",
              {
                ["hidden md:block"]: mobileActiveTab === EMobileActiveTab.CHAT,
              },
            )}
          />
          <DynamicChatCard
            className={cn(
              "m-0 w-full rounded-b-lg bg-[#181a1d] md:rounded-lg",
              {
                ["hidden md:block"]: mobileActiveTab === EMobileActiveTab.AGENT,
              },
            )}
          />
        </div>
      </div>
    </AuthInitializer>
  )
}
