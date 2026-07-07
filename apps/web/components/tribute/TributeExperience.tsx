"use client";

import { useState, useEffect, useRef } from "react";
import EntryIntro from "./EntryIntro";
import ScrollStory from "./ScrollStory";
import VideoEnding from "./VideoEnding";
import { AnimatePresence } from "framer-motion";

type TributeStep = "intro" | "story" | "video";

export default function TributeExperience({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<TributeStep>("intro");
  const audioRef = useRef<HTMLAudioElement>(null);

  // Mount the tribute-active class on the body to hide Nav/Footer
  useEffect(() => {
    document.body.classList.add("tribute-active");
    return () => {
      document.body.classList.remove("tribute-active");
    };
  }, []);

  const finishTribute = () => {
    localStorage.setItem("cr7TributeSeen", "true");
    onComplete();
  };

  const startStory = () => {
    setStep("story");
    if (audioRef.current) {
      // Set to 40% volume so it's a nice background melody
      audioRef.current.volume = 0.4;
      // Start background music after user interaction
      audioRef.current.play().catch((e) => console.log("Audio autoplay blocked:", e));
    }
  };

  const startVideo = () => {
    setStep("video");
    if (audioRef.current) {
      // Stop the music right before the video starts
      audioRef.current.pause();
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-black font-sans relative">
      {/* 
        Background Music - Indila Love Story
        Volume is handled via the audioRef below
      */}
      <audio ref={audioRef} src="/lovestory.mpeg" loop />

      <AnimatePresence mode="wait">
        {step === "intro" && (
          <EntryIntro key="intro" onStart={startStory} />
        )}
        
        {step === "story" && (
          <ScrollStory key="story" onFinish={startVideo} />
        )}

        {step === "video" && (
          <VideoEnding key="video" onFinish={finishTribute} />
        )}
      </AnimatePresence>
    </div>
  );
}

