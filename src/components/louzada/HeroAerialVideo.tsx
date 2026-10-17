"use client";

import { useEffect, useRef } from "react";

type HeroAerialVideoProps = {
  src?: string;
};

export function HeroAerialVideo({ src = "/hero-aerial.mp4" }: HeroAerialVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const playFromStart = () => {
      if (video.ended || video.currentTime >= (video.duration || Infinity) - 0.05) {
        video.currentTime = 0;
      }
      void video.play().catch(() => {});
    };

    const onEnded = () => {
      video.currentTime = 0;
      void video.play().catch(() => {});
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        playFromStart();
      }
    };

    video.addEventListener("ended", onEnded);
    document.addEventListener("visibilitychange", onVisibility);

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      playFromStart();
    } else {
      video.addEventListener("loadeddata", playFromStart, { once: true });
    }

    const keepAlive = window.setInterval(() => {
      if (document.hidden) return;
      if (video.paused && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        playFromStart();
      }
    }, 800);

    return () => {
      window.clearInterval(keepAlive);
      video.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      className="absolute inset-0 h-full w-full object-cover object-center"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden
    />
  );
}
