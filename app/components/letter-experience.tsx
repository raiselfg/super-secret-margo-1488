"use client";

import { AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import { useEffect, useReducer, useRef, useState } from "react";
import { logLetterEvent } from "../lib/letter-log";
import { letter } from "../content/letter";
import { initialPlayback, openingTiming, playbackReducer } from "../lib/letter-playback";
import "./letter/letter.css";
import IntroScene from "./letter/intro-scene";
import ReadingScene from "./letter/reading-scene";
import type { LetterOrigin } from "./letter/letter-paper";

export default function LetterExperience() {
  const [state, dispatch] = useReducer(playbackReducer, initialPlayback);
  const opened = useRef(false);
  const visited = useRef(false);
  const stagesLogged = useRef(new Set<string>());
  const reduced = !!useReducedMotion();
  const [letterOrigin, setLetterOrigin] = useState<LetterOrigin | null>(null);

  useEffect(() => {
    if (!visited.current) {
      visited.current = true;
      logLetterEvent("visit");
    }
    const onVisibility = () => logLetterEvent(document.hidden ? "hidden" : "returned");
    const onLeave = () => logLetterEvent("leave");
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onLeave);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onLeave);
    };
  }, []);

  useEffect(() => {
    if (stagesLogged.current.has(state.stage)) return;
    stagesLogged.current.add(state.stage);
    if (state.stage === "lift") logLetterEvent("flap_opened");
    if (state.stage === "depart") logLetterEvent("envelope_depart");
  }, [state.stage]);

  useEffect(() => {
    if (state.stage !== "flap" && state.stage !== "lift" && state.stage !== "depart") return;
    const stage = state.stage;
    const timer = window.setTimeout(() => {
      if (stage === "lift") {
        const sheet = document.querySelector(".letter-transfer")?.getBoundingClientRect();
        if (sheet) setLetterOrigin({ left: sheet.left, top: sheet.top, width: sheet.width, height: sheet.height });
      }
      dispatch({ type: stage === "flap" ? "flap-complete" : stage === "lift" ? "lift-complete" : "envelope-complete" });
    }, openingTiming[stage] * 1000);
    return () => window.clearTimeout(timer);
  }, [state.stage]);

  return (
    <MotionConfig reducedMotion="user">
      <main className="experience">
        <div className="ambient" aria-hidden="true" />
        {state.stage === "depart" && letterOrigin && (
          <div
            className="letter-held"
            aria-hidden="true"
            style={{ left: letterOrigin.left, top: letterOrigin.top, width: letterOrigin.width, height: letterOrigin.height }}
          ><span className="letter-transfer"><i className="peek-fold" /></span></div>
        )}
        <AnimatePresence mode="sync">
          {state.stage === "letter" ? (
            <ReadingScene
              key="letter"
              content={letter}
              showAll={state.showAll}
              reduced={reduced}
              origin={letterOrigin}
            />
          ) : state.stage !== "depart" ? (
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
          ) : null}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
