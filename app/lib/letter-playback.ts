export type Stage = "closed" | "flap" | "lift" | "depart" | "letter";
export type PlaybackState = { stage: Stage; showAll: boolean };
export type PlaybackAction =
  | { type: "open"; reduced: boolean }
  | { type: "flap-complete" }
  | { type: "lift-complete" }
  | { type: "envelope-complete" }
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
      return state.stage === "lift" ? { ...state, stage: "depart" } : state;
    case "envelope-complete":
      return state.stage === "depart" ? { ...state, stage: "letter" } : state;
    case "show-all":
      return state.stage === "letter" ? { ...state, showAll: true } : state;
    case "replay":
      return initialPlayback;
  }
}

export const openingTiming = { flap: 1.1, lift: 1.3, depart: 1.1 };

export const revealTiming = {
  unfold: 1.7,
  greeting: 0.7,
  start: 2.15,
  paragraph: 1.2,
  wordStagger: 0.06,
  gap: 0.25,
  signature: 1.8,
  endingLead: 0.45,
};

export function getWordStagger(wordCount: number) {
  return Math.min(revealTiming.wordStagger, 3.4 / Math.max(1, wordCount - 1));
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
