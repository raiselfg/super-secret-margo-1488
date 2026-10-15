import { useEffect, useRef } from "react";
import { logLetterEvent, type LetterLogEvent } from "../lib/letter-log";

export function useLetterScrollLog() {
  const paper = useRef<HTMLDivElement>(null);
  const sent = useRef(new Set<LetterLogEvent>());

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const element = paper.current;
        if (!element) return;
        const bounds = element.getBoundingClientRect();
        if (bounds.top >= window.innerHeight || bounds.bottom <= 0) return;
        if (!sent.current.has("scroll")) {
          sent.current.add("scroll");
          logLetterEvent("scroll");
        }
        // Track travel until the bottom of the paper enters the viewport.
        const distance = Math.max(1, bounds.height - window.innerHeight);
        const progress = bounds.bottom <= window.innerHeight + 1
          ? 1
          : Math.min(1, Math.max(0, -bounds.top / distance));
        for (const event of ["25", "50", "75", "100"] as const) {
          if (progress * 100 >= Number(event) && !sent.current.has(event)) {
            sent.current.add(event);
            logLetterEvent(event);
          }
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return paper;
}
