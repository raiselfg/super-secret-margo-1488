export type LetterContent = {
  recipient: string;
  greeting: string;
  paragraphs: readonly string[];
  closing: string;
  signature: string;
  illustration: string;
  illustrationAlt: string;
  illustrationCaption: string;
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
  finalNote: "Помни марго ты самое главное что есть у меня",
};
