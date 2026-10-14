import type { RefObject } from "react";
import { motion } from "motion/react";
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
  const closed = stage === "closed";
  const lifting = stage === "lift";
  const duration = lifting ? openingTiming.lift : openingTiming.flap;

  return (
    <div className="envelope-space">
      <div className="envelope-hitarea">
        <button
          ref={buttonRef}
          type="button"
          onClick={onOpen}
          disabled={!closed}
          aria-label={'Открыть письмо для ' + recipient}
          className="envelope-trigger"
        />
        <motion.div
          className="envelope"
          aria-hidden="true"
          initial={false}
          animate={{
            rotate: closed ? -5 : 0,
            y: lifting ? [0, 8, 28, 38] : 0,
          }}
          transition={{ duration, times: [0, 0.22, 0.72, 1], ease: "easeInOut" }}
        >
          <span className="envelope-back" />
          <motion.span
            className="letter-peek"
            initial={false}
            animate={{
              y: lifting ? ["0%", "-16%", "-105%", "-120%"] : "0%",
              rotate: lifting ? [0, -2, 1.2, 0] : 0,
              rotateX: lifting ? [0, 12, -6, 0] : 0,
              scale: lifting ? [1, 1, 1.04, 1.07] : 1,
              boxShadow: lifting
                ? ["0 0 0 #0000", "0 8px 12px #51382022", "3px 20px 24px #0003", "0 26px 32px #0002"]
                : "0 0 0 #0000",
            }}
            transition={{ duration: openingTiming.lift, times: [0, 0.22, 0.78, 1], ease: [0.4, 0, 0.2, 1] }}
          >
            <i className="peek-fold" />
          </motion.span>
          <motion.span
            className="envelope-interior-shadow"
            initial={false}
            animate={{ opacity: closed ? 0 : lifting ? [0.45, 0.55, 0.18, 0.08] : [0, 0, 0.6, 0.45] }}
            transition={{ duration, times: [0, 0.22, 0.72, 1] }}
          />
          <span className="envelope-pocket" /><span className="envelope-hinge" />
          <motion.span
            className="envelope-flap" style={{ zIndex: lifting ? 1 : 4 }}
            initial={false}
            animate={{
              rotateX: closed ? 0 : lifting ? -180 : [0, 0, -95, -180],
            }}
            transition={{
              rotateX: { duration: openingTiming.flap, times: [0, 0.2, 0.62, 1], ease: [0.4, 0, 0.2, 1] },
            }}
          >
            <span className="flap-face flap-front" />
            <span className="flap-face flap-inside" />
          </motion.span>
          <motion.span
            className="seal"
            initial={false}
            animate={{
              opacity: closed ? 1 : [1, 1, 0],
              scale: closed ? 1 : [1, 1.1, 0.94],
              rotate: closed ? 0 : [0, -12, 18],
              x: closed ? 0 : [0, -3, 13],
              y: closed ? 0 : [0, -9, 34],
            }}
            transition={{ duration: 0.48, times: [0, 0.35, 1], ease: "easeIn" }}
          >м</motion.span>
          <span className="envelope-address">{recipient}<span>самой любимой на свете</span></span>
        </motion.div>
      </div>
    </div>
  );
}
