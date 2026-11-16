import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { amogusMemory, kupchinoMemory } from "../../content/letter";
import "./memory-box.css";

const correctAnswer = "У гаражей в Купчино";
const answers = ["В парке", correctAnswer, "Во дворе у дома"];

const memoryIds = ["kupchino", "amogus"] as const;
type MemoryId = (typeof memoryIds)[number];

const memories = {
  kupchino: { ...kupchinoMemory, title: "Гаражи в Купчино", clue: "Фотосессия", action: "Угадать место" },
  amogus: { ...amogusMemory, title: "Амогус", clue: "Амогус", action: "Поймать амогуса" },
};

const hidingSpots = ["2 / 2", "1 / 3", "3 / 1", "2 / 3"];

function AmogusChase({ onCatch }: { onCatch: () => void }) {
  const [spot, setSpot] = useState(0);
  const reducedMotion = useReducedMotion();
  const canEscape = !reducedMotion && spot < hidingSpots.length - 1;

  return (
    <>
      <p className="memory-box-chase-instructions">Поймай амогуса, чтобы открыть фото.</p>
      <div className="memory-box-chase-field">
        <button
          type="button"
          className="memory-box-amogus"
          style={{ gridArea: hidingSpots[spot] }}
          aria-label="Поймать амогуса"
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse" && canEscape) setSpot(spot + 1);
          }}
          onClick={(event) => {
            if (event.detail === 0 || !canEscape) {
              onCatch();
            } else {
              setSpot(spot + 1);
            }
          }}
        >
          <span className="memory-box-amogus-body" aria-hidden="true"><i /></span>
        </button>
      </div>
    </>
  );
}

export default function MemoryBox() {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const screenTitle = useRef<HTMLHeadingElement>(null);
  const dialogId = useId();
  const titleId = useId();
  const [selected, setSelected] = useState<MemoryId | null>(null);
  const [openedMemories, setOpenedMemories] = useState({ kupchino: false, amogus: false });
  const [answer, setAnswer] = useState<string>();
  const memory = selected ? memories[selected] : null;
  const revealed = selected !== null && openedMemories[selected];

  useEffect(() => {
    if (dialog.current?.open) (screenTitle.current ?? title.current)?.focus();
  }, [selected, revealed]);

  function revealMemory() {
    if (selected) setOpenedMemories((current) => ({ ...current, [selected]: true }));
  }

  return (
    <div className="memory-box-box">
      <button
        className="memory-box-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-controls={dialogId}
        onClick={() => {
          dialog.current?.showModal();
          (screenTitle.current ?? title.current)?.focus();
        }}
      >
        Открыть нашу коробку <span aria-hidden="true">♥</span>
      </button>
      <dialog ref={dialog} className="memory-dialog" id={dialogId} aria-labelledby={titleId}>
        <button
          className="memory-box-close"
          type="button"
          aria-label="Закрыть коробку"
          onClick={() => dialog.current?.close()}
        >
          ×
        </button>
        <h2 ref={title} id={titleId} tabIndex={-1} className="memory-box-title">Наша коробка воспоминаний</h2>
        {memory ? (
          <>
            <button className="memory-box-back" type="button" onClick={() => setSelected(null)}>
              ← К карточкам
            </button>
            {revealed ? (
              <figure className="memory-box-photo">
                <h3 ref={screenTitle} tabIndex={-1} className="memory-box-memory-title">
                  {selected === "amogus" ? "Амогус пойман!" : memory.title}
                </h3>
                <Image
                  src={memory.src}
                  alt={memory.alt}
                  width={960}
                  height={1280}
                  sizes="(max-width: 380px) 75vw, 280px"
                />
                <figcaption>{memory.caption}</figcaption>
              </figure>
            ) : selected === "amogus" ? (
              <section>
                <h3 ref={screenTitle} tabIndex={-1} className="memory-box-memory-title">{memory.clue}</h3>
                <AmogusChase onCatch={revealMemory} />
              </section>
            ) : (
              <>
                <h3 ref={screenTitle} tabIndex={-1} className="memory-box-memory-title">{memory.clue}</h3>
                <fieldset className="memory-box-riddle">
                  <legend>Где мы устроили фотосессию?</legend>
                  {answers.map((option) => (
                    <button
                      className="memory-box-answer"
                      type="button"
                      key={option}
                      onClick={() => {
                        if (option === correctAnswer) revealMemory();
                        else setAnswer(option);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </fieldset>
                <output className="memory-box-hint">
                  {answer && `«${answer}» — попробуй ещё раз ♥`}
                </output>
                <button className="memory-box-skip" type="button" onClick={revealMemory}>Показать фото</button>
              </>
            )}
          </>
        ) : (
          <div className="memory-box-cards">
            {memoryIds.map((id) => (
              <button key={id} type="button" className="memory-box-card" onClick={() => setSelected(id)}>
                <strong>{openedMemories[id] ? memories[id].title : memories[id].clue}</strong>{" "}
                <span>{openedMemories[id] ? "Посмотреть фото" : memories[id].action}</span>
              </button>
            ))}
          </div>
        )}
      </dialog>
    </div>
  );
}
