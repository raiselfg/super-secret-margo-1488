import Image from "next/image";
import { useRef } from "react";
import type { LetterContent } from "../../content/letter";

type LetterPhotoProps = {
  content: LetterContent;
  visible: boolean;
};

export default function LetterPhoto({ content, visible }: LetterPhotoProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className="photo-trigger"
        disabled={!visible}
        aria-label="Рассмотреть наше фото"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        <Image src={content.illustration} alt={content.illustrationAlt} width={225} height={270} sizes="(max-width: 600px) 187.5px, 217.5px" />
        <span className="photo-hint" aria-hidden="true">рассмотреть ↗</span>
      </button>
      <dialog
        ref={dialog}
        className="photo-dialog"
        aria-label="Наше фото"
      >
        <div className="photo-dialog-card">
          <button type="button" className="photo-close" autoFocus onClick={() => dialog.current?.close()} aria-label="Закрыть фото">×</button>
          <Image src={content.illustration} alt={content.illustrationAlt} width={750} height={900} sizes="(max-width: 600px) 85vw, 540px" />
          <p>{content.illustrationCaption}</p>
        </div>
      </dialog>
    </>
  );
}
