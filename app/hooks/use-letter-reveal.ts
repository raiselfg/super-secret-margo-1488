"use client"

import { useEffect, useState } from "react";
import { getRevealSchedule } from "../lib/letter-playback";

export function useLetterReveal(paragraphs: readonly string[], instant: boolean) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [endingVisible, setEndingVisible] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (instant) return;
    const schedule = getRevealSchedule(paragraphs);
    const timers = schedule.paragraphs.map((delay, index) =>
      window.setTimeout(() => setVisibleCount(index + 1), delay * 1000),
    );
    timers.push(window.setTimeout(() => setEndingVisible(true), schedule.ending * 1000));
    timers.push(window.setTimeout(() => setComplete(true), schedule.complete * 1000));
    return () => timers.forEach(window.clearTimeout);
  }, [paragraphs, instant]);

  return {
    visibleCount: instant ? paragraphs.length : visibleCount,
    endingVisible: instant || endingVisible,
    complete: instant || complete,
  };
}
