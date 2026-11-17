import { useState } from "react";

const outfit = [
  {
    name: "top",
    label: "Верх",
    correct: "hoodie",
    options: [
      { id: "hoodie", label: "Чёрная кофта с капюшоном", color: "#24202a" },
      { id: "sweater", label: "Белый свитер", color: "#f4efe8" },
    ],
  },
  {
    name: "bottom",
    label: "Низ",
    correct: "gray-jeans",
    options: [
      { id: "blue-jeans", label: "Синие джинсы", color: "#455c7e" },
      { id: "gray-jeans", label: "Тёмно-серые джинсы", color: "#4b484a" },
    ],
  },
  {
    name: "shoes",
    label: "Обувь",
    correct: "high-tops",
    options: [
      { id: "high-tops", label: "Чёрные кеды на липучках", color: "#29252e" },
      { id: "trainers", label: "Белые кроссовки", color: "#f4efe8" },
    ],
  },
];

export default function OutfitPuzzle({ onSolved }: { onSolved: () => void }) {
  const [matches, setMatches] = useState<number | null>(null);

  return (
    <form
      className="memory-box-outfit"
      onChange={() => setMatches(null)}
      onSubmit={(event) => {
        event.preventDefault();
        const choices = new FormData(event.currentTarget);
        const correctCount = outfit.filter(({ name, correct }) => choices.get(name) === correct).length;
        if (correctCount === outfit.length) onSolved();
        else setMatches(correctCount);
      }}
    >
      <p>Вспомни, что ты выбрала мне в секонде.</p>
      {outfit.map(({ name, label, options }) => (
        <fieldset key={name}>
          <legend>{label}</legend>
          <div className="memory-box-outfit-options">
            {options.map((option) => (
              <label key={option.id} className="memory-box-outfit-option">
                <input type="radio" name={name} value={option.id} required />
                <span aria-hidden="true" style={{ backgroundColor: option.color }} />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <button className="memory-box-trigger memory-box-outfit-submit" type="submit">Проверить лук</button>
      <output className="memory-box-hint">
        {matches !== null && `Совпало: ${matches} из ${outfit.length}. Попробуй ещё раз ♥`}
      </output>
    </form>
  );
}
