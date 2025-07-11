"use client";

import React, { useState } from "react"
import { IMicrophoneAudioTrack } from "agora-rtc-sdk-ng"
import { cn } from "@/lib/utils";
import { Maximize, Minimize } from "lucide-react";
import ReactDOM from "react-dom";

interface AvatarProps {
  audioTrack?: IMicrophoneAudioTrack
}

export default function VideoAvatar({ audioTrack }: AvatarProps) {
  // 判断是否在说话
  const isTalking = !!(audioTrack && (audioTrack as any).isPlaying)
  const [fullscreen, setFullscreen] = useState(false)

  const avatarContent = (
    <div className={cn(
      fullscreen
        ? "fixed left-0 top-0 w-screen h-screen z-[9999] bg-black flex items-center justify-center"
        : "relative h-full w-full overflow-hidden rounded-lg"
    )}>
      <button
        className={cn(
          "absolute p-2 rounded-lg bg-black/50 hover:bg-black/70 transition z-50",
          fullscreen ? "top-4 right-4" : "top-2 right-2"
        )}
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
        onClick={() => setFullscreen(prev => !prev)}
      >
        {fullscreen ? <Minimize className="text-white" size={24} /> : <Maximize className="text-white" size={24} />}
      </button>
      <video
        src={isTalking ? "/talk.mp4" : "/stand.mp4"}
        autoPlay
        loop
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: fullscreen ? 0 : "50%",
          background: fullscreen ? "#000" : undefined,
          transition: 'all 0.2s'
        }}
      />
    </div>
  );

  if (fullscreen && typeof window !== "undefined") {
    return ReactDOM.createPortal(avatarContent, document.body);
  }
  return avatarContent;
}
