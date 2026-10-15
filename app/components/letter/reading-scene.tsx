import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LetterContent } from "../../content/letter";
import { useLetterReveal } from "../../hooks/use-letter-reveal";
import { useLetterScrollLog } from "../../hooks/use-letter-scroll-log";
import LetterPaper, { type LetterOrigin } from "./letter-paper";
import { logLetterEvent } from "../../lib/letter-log";

type ReadingSceneProps = {
  content: LetterContent;
  showAll: boolean;
  reduced: boolean;
  origin: LetterOrigin | null;
};

export default function ReadingScene({ content, showAll, reduced, origin }: ReadingSceneProps) {
  const paper = useLetterScrollLog();
  const heading = useRef<HTMLHeadingElement>(null);
  const instant = showAll || reduced;
  const [unfolded, setUnfolded] = useState(false);
  const onUnfoldComplete = useCallback(() => setUnfolded(true), []);
  const [greeted, setGreeted] = useState(false);
  const onGreetingComplete = useCallback(() => setGreeted(true), []);
  const reveal = useLetterReveal(content.paragraphs, instant, greeted);
  const logged = useRef({ shown: false, paragraphs: 0, ending: false, complete: false });

  useEffect(() => {
    const sent = logged.current;
    if (!sent.shown) {
      sent.shown = true;
      logLetterEvent("letter_shown");
    }
    for (let index = sent.paragraphs; index < reveal.visibleCount; index++) {
      logLetterEvent("paragraph_shown", `Абзац: ${index + 1} из ${content.paragraphs.length}`);
    }
    sent.paragraphs = reveal.visibleCount;
    if (reveal.endingVisible && !sent.ending) {
      sent.ending = true;
      logLetterEvent("ending_shown");
    }
    if (reveal.complete && !sent.complete) {
      sent.complete = true;
      logLetterEvent("reveal_complete");
    }
  }, [reveal.visibleCount, reveal.endingVisible, reveal.complete, content.paragraphs.length]);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [instant]);

  return (
    <section className="reading">
      <div ref={paper}>
        <LetterPaper content={content} headingRef={heading} visibleCount={reveal.visibleCount} endingVisible={reveal.endingVisible} instant={instant} reduced={reduced} origin={origin} onUnfoldComplete={onUnfoldComplete} unfolded={unfolded} onGreetingComplete={onGreetingComplete} />
      </div>
      <div className="after-letter">
        <motion.p initial={false} animate={{ opacity: reveal.complete ? 1 : 0 }} transition={{ duration: instant ? 0 : 0.9 }}>{content.finalNote}</motion.p>
      </div>
    </section>
  );
}
