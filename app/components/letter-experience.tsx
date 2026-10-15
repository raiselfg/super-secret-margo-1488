"use client";

import { AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import { useEffect, useReducer, useRef } from "react";
import { logLetterEvent } from "../lib/letter-log";
import { letter } from "../content/letter";
import { initialPlayback, openingTiming, playbackReducer } from "../lib/letter-playback";
import "./letter/letter.css";
import IntroScene from "./letter/intro-scene";
import ReadingScene from "./letter/reading-scene";

export default function LetterExperience() {
  const [state, dispatch] = useReducer(playbackReducer, initialPlayback);
  const opened = useRef(false);
  const reduced = !!useReducedMotion();

  useEffect(() => {
    if (state.stage !== "flap" && state.stage !== "lift") return;
    const stage = state.stage;
    const timer = window.setTimeout(() => {
      dispatch({ type: stage === "flap" ? "flap-complete" : "lift-complete" });
    }, openingTiming[stage] * 1000);
    return () => window.clearTimeout(timer);
  }, [state.stage]);

  return (
    <MotionConfig reducedMotion="user">
      <main className="experience">
        <div className="ambient" aria-hidden="true" />
        <AnimatePresence mode="wait">
          {state.stage === "letter" ? (
            <ReadingScene
              key="letter"
              content={letter}
              showAll={state.showAll}
              reduced={reduced}
            />
          ) : (
            <IntroScene
              key="envelope"
              stage={state.stage}
              content={letter}
              reduced={reduced}
              onOpen={() => {
                if (opened.current) return;
                opened.current = true;
                logLetterEvent("open");
                dispatch({ type: "open", reduced });
              }}
            />
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
