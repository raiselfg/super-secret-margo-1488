"use client"

import { useEffect, useState } from "react";
import { getRevealSchedule, revealTiming } from "../lib/letter-playback";

export function useLetterReveal(paragraphs: readonly string[], instant: boolean, ready: boolean) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [endingVisible, setEndingVisible] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (instant || !ready) return;
    const schedule = getRevealSchedule(paragraphs);
    const timers = schedule.paragraphs.map((delay, index) =>
      window.setTimeout(() => setVisibleCount(index + 1), Math.max(0, delay - revealTiming.start) * 1000),
    );
    timers.push(window.setTimeout(() => setEndingVisible(true), (schedule.ending - revealTiming.start) * 1000));
    timers.push(window.setTimeout(() => setComplete(true), (schedule.complete - revealTiming.start) * 1000));
    return () => timers.forEach(window.clearTimeout);
  }, [paragraphs, instant, ready]);

  return {
    visibleCount: instant ? paragraphs.length : visibleCount,
    endingVisible: instant || endingVisible,
    complete: instant || complete,
  };
}
