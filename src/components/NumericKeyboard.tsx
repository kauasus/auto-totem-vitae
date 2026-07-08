import React from "react";
import { Delete } from "lucide-react";
import { playClick } from "../utils/sounds";

interface NumericKeyboardProps {
  onKeyPress: (key: string) => void;
  className?: string;
  soundEnabled?: boolean;
}

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "←", "0", "⌫"];

const NumericKeyboard: React.FC<NumericKeyboardProps> = ({
  onKeyPress,
  className,
  soundEnabled = true,
}) => {
  const handleClick = (k: string) => {
    // tocar som (somente se permitido)
    if (soundEnabled) playClick(0.1);
    if (k === "←") onKeyPress("backspace");
    else if (k === "⌫") onKeyPress("backspace");
    else onKeyPress(k);
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-4 max-w-md mx-auto ${className ?? ""}`}
    >
      <div className="grid grid-cols-3 gap-4">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => handleClick(key)}
            className="bg-[#b91c1c] text-white font-bold text-2xl rounded-lg shadow-md hover:bg-[#991414] active:scale-95 transition-transform py-5 select-none"
            aria-label={
              key === "←" ? "Voltar" : key === "⌫" ? "Limpar" : `Número ${key}`
            }
            type="button"
          >
            {key === "⌫" ? <Delete className="mx-auto" /> : key}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumericKeyboard;
