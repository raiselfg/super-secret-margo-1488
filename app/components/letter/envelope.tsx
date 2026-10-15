import { useState, type CSSProperties, type RefObject } from "react";
import { motion, useIsPresent, useReducedMotion } from "motion/react";
import { openingTiming, type Stage } from "../../lib/letter-playback";

type EnvelopeProps = {
  stage: Stage;
  buttonRef: RefObject<HTMLButtonElement | null>;
  onOpen: () => void;
  recipient: string;
};

export default function Envelope({
  stage, buttonRef, onOpen, recipient,
}: EnvelopeProps) {
  const present = useIsPresent();
  const reduced = useReducedMotion();
  const [sealReleased, setSealReleased] = useState(false);
  const timing = {
    "--envelope-flap-duration": `${openingTiming.flap}s`,
    "--envelope-lift-duration": `${openingTiming.lift}s`,
  } as CSSProperties;

  return (
    <div className="envelope-space">
      <div className="envelope-hitarea" data-stage={stage} style={timing}>
        <button
          ref={buttonRef}
          type="button"
          onClick={onOpen}
          disabled={stage !== "closed"}
          aria-label={"Открыть письмо для " + recipient}
          className="envelope-trigger"
        />
        <motion.div
          className="envelope"
          aria-hidden="true"
          data-departing={!present}
          initial={false}
          animate={{ rotate: stage === "closed" ? -5 : 0, transition: { duration: reduced ? 0 : 0.55 } }}
          exit={reduced ? { opacity: 0 } : { x: "-110vw", y: 24, rotate: -12 }}
          transition={{
            duration: reduced ? 0 : openingTiming.depart - 0.1,
            ease: [0.45, 0, 0.55, 1],
            rotate: { duration: reduced ? 0 : openingTiming.depart - 0.1 },
          }}
        >
          <span className="envelope-back" />
          <span className="letter-peek">
            <span className="letter-transfer">
              <i className="peek-fold" />
            </span>
          </span>
          <span className="envelope-interior-shadow" />
          <span className="envelope-pocket" />
          <span className="envelope-hinge" />
          <span className="envelope-flap" />
          {!sealReleased && (stage === "closed" || stage === "flap") && (
            <span
              className="seal"
              onAnimationEnd={(event) => {
                if (event.animationName === "envelope-seal-release") setSealReleased(true);
              }}
            >м</span>
          )}
          <span className="envelope-address">{recipient}<span>самой любимой на свете</span></span>
        </motion.div>
      </div>
    </div>
  );
}
