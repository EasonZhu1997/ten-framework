"use client";

import React, { useState, useRef, useEffect } from "react"
import { IMicrophoneAudioTrack } from "agora-rtc-sdk-ng"
import { cn } from "@/lib/utils";
import { Maximize, Minimize } from "lucide-react";
import ReactDOM from "react-dom";

interface AvatarProps {
  audioTrack?: IMicrophoneAudioTrack
}

export default function VideoAvatar({ audioTrack }: AvatarProps) {
  // 判断是否在说话
  const [isTalking, setIsTalking] = useState(false);
  const [fullscreen, setFullscreen] = useState(false)
  const talkVideoRef = useRef<HTMLVideoElement>(null);
  const standVideoRef = useRef<HTMLVideoElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    if (!audioTrack) return;
    const mediaStreamTrack = audioTrack.getMediaStreamTrack();
    if (!mediaStreamTrack) return;
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const mediaStream = new MediaStream([mediaStreamTrack]);
    const source = audioContext.createMediaStreamSource(mediaStream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    analyserRef.current = analyser;
    audioContextRef.current = audioContext;
    sourceRef.current = source;

    let animationId: number;
    const checkVolume = () => {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      // 简单取最大值判断是否在说话
      const max = Math.max(...dataArray);
      const threshold = 20; // 阈值可调整
      setIsTalking(max > threshold);
      animationId = requestAnimationFrame(checkVolume);
    };
    checkVolume();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      analyser.disconnect();
      source.disconnect();
      audioContext.close();
    };
  }, [audioTrack]);

  useEffect(() => {
    // 切换时让当前video从头播放
    if (isTalking && talkVideoRef.current) {
      talkVideoRef.current.currentTime = 0;
      talkVideoRef.current.play().catch(() => { });
    }
    if (!isTalking && standVideoRef.current) {
      standVideoRef.current.currentTime = 0;
      standVideoRef.current.play().catch(() => { });
    }
  }, [isTalking, fullscreen]);

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
      {/* 双video方案，两个video都渲染，只切显隐 */}
      <video
        ref={talkVideoRef}
        src="/talk.mp4"
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        disablePictureInPicture
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: fullscreen ? 0 : "50%",
          background: fullscreen ? "#000" : undefined,
          transition: 'opacity 0.2s',
          opacity: isTalking ? 1 : 0,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2
        }}
      />
      <video
        ref={standVideoRef}
        src="/stand.mp4"
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        disablePictureInPicture
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: fullscreen ? 0 : "50%",
          background: fullscreen ? "#000" : undefined,
          transition: 'opacity 0.2s',
          opacity: isTalking ? 0 : 1,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}
      />
    </div>
  );

  if (fullscreen && typeof window !== "undefined") {
    return ReactDOM.createPortal(avatarContent, document.body);
  }
  return avatarContent;
}
