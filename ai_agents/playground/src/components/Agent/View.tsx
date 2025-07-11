"use client"

import { useMultibandTrackVolume } from "@/common"
import { cn } from "@/lib/utils"
// import AudioVisualizer from "../audioVisualizer"
import { IMicrophoneAudioTrack } from "agora-rtc-sdk-ng"
import AudioVisualizer from "@/components/Agent/AudioVisualizer"
import VideoAvatar from "@/components/Agent/AvatarTrulience";

export interface AgentViewProps {
  audioTrack?: IMicrophoneAudioTrack
}

export default function AgentView(props: AgentViewProps) {
  const { audioTrack } = props

  return (
    <div className={cn(
      "flex h-auto w-full flex-col items-center justify-center px-4 py-5",
      "bg-[#0F0F11] bg-gradient-to-br from-[rgba(27,66,166,0.16)] via-[rgba(27,45,140,0.00)] to-[#11174E] shadow-[0px_3.999px_48.988px_0px_rgba(0,7,72,0.12)] backdrop-blur-[7px]",
    )}>
      <div className="mb-2 text-lg font-semibold text-[#EAECF0]">Agent</div>
      <div className="mt-2 h-40 w-40 flex items-center justify-center">
        <VideoAvatar audioTrack={audioTrack} />
      </div>
    </div>
  )
}
