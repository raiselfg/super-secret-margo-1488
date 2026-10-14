export type Stage = "closed" | "flap" | "lift" | "letter";
export type PlaybackState = { stage: Stage; showAll: boolean };
export type PlaybackAction =
  | { type: "open"; reduced: boolean }
  | { type: "flap-complete" }
  | { type: "lift-complete" }
  | { type: "show-all" }
  | { type: "replay" };

export const initialPlayback: PlaybackState = { stage: "closed", showAll: false };

// Animation callbacks can arrive more than once; only accept the expected stage.
export function playbackReducer(state: PlaybackState, action: PlaybackAction): PlaybackState {
  switch (action.type) {
    case "open":
      return state.stage === "closed"
        ? { stage: action.reduced ? "letter" : "flap", showAll: action.reduced }
        : state;
    case "flap-complete":
      return state.stage === "flap" ? { ...state, stage: "lift" } : state;
    case "lift-complete":
      return state.stage === "lift" ? { ...state, stage: "letter" } : state;
    case "show-all":
      return state.stage === "letter" ? { ...state, showAll: true } : state;
    case "replay":
      return initialPlayback;
  }
}

export const openingTiming = { flap: 1.4, lift: 1.8 };

export const revealTiming = {
  unfold: 1.8,
  start: 1.9,
  paragraph: 0.55,
  wordStagger: 0.065,
  gap: 0.8,
  signature: 1.8,
  endingLead: 0.45,
};

export function getWordStagger(wordCount: number) {
  return Math.min(revealTiming.wordStagger, 2.8 / Math.max(1, wordCount - 1));
}

export function getRevealSchedule(content: readonly string[]) {
  let cursor = revealTiming.start;
  const paragraphs = content.map((paragraph) => {
    const start = cursor;
    const words = paragraph.trim().split(/\s+/).filter(Boolean).length;
    cursor += revealTiming.paragraph
      + Math.max(0, words - 1) * getWordStagger(words)
      + revealTiming.gap;
    return start;
  });
  return {
    paragraphs,
    ending: cursor,
    complete: cursor + revealTiming.endingLead + revealTiming.signature,
  };
}
