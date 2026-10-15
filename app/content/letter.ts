type LetterMemory = { src: string; alt: string; caption: string };

export type LetterContent = {
  recipient: string;
  greeting: string;
  paragraphs: readonly string[];
  closing: string;
  signature: string;
  illustration: string;
  illustrationAlt: string;
  illustrationCaption: string;
  photos: readonly [LetterMemory, ...LetterMemory[]];
  finalNote: string;
};

export const letter: LetterContent = {
  recipient: "Марго",
  greeting: "Маленькая моя",
  paragraphs: [
    "Прости меня пожалуйста Марго моя самая любимая на свете",
    "Мне очень жаль Марго что я причинил тебе боль. я и вправду тебя слышу и слушаю",
    "Я понимаю что это не исправит ничего, но я правда Марго понимаю что из за моей этой невниматенльности и что я не так все запоминаю тебе очень тяжело",
    "Я просто хотел, чтобы ты знала что ты мне очень дорога любимая моя",
  ],
  closing: "От сердца",
  signature: "Дима",
  illustration: "/mi.jpg",
  illustrationAlt: "Это крутые мы",
  illustrationCaption: "смотри марго какие мы",
  photos: [
    { src: "/mi.jpg", alt: "Это крутые мы", caption: "смотри марго какие мы" },
    { src: "/photo_1_2026-10-15_19-34-21.jpg", alt: "амогус", caption: "помнишь ты амогуса показывала" },
    { src: "/photo_2_2026-10-15_19-34-21.jpg", alt: "шорты", caption: "а это ты мне свои шорты дала" },
    { src: "/photo_3_2026-10-15_19-34-21.jpg", alt: "свастон", caption: "а тут ты случайно легла так" },
    { src: "/photo_4_2026-10-15_19-34-21.jpg", alt: "смурфики", caption: "тут мы смурфикам лизали" },
    { src: "/photo_5_2026-10-15_19-34-21.jpg", alt: "гаражи", caption: "фоткались в гаражах купчино" },
    { src: "/photo_6_2026-10-15_19-34-21.jpg", alt: "вищенки", caption: "тут у тебя вишенки" },
    { src: "/photo_7_2026-10-15_19-34-21.jpg", alt: "лук сешка", caption: "собрала мне лук в сешке" },
  ],
  finalNote: "Помни марго ты самое главное что есть у меня",
};
