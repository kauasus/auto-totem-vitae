import React from "react";
import { Delete, RotateCcw } from "lucide-react";
import { playClick } from "../utils/sounds";

interface EmailKeyboardProps {
  onKeyPress: (key: string) => void;
  className?: string;
  soundEnabled?: boolean;
}

const rows = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m", ".", "@"],
  ["_", "-", "+", "backspace", "clear"],
];

const EmailKeyboard: React.FC<EmailKeyboardProps> = ({
  onKeyPress,
  className,
  soundEnabled = true,
}) => {
  const handleClick = (key: string) => {
    if (soundEnabled) playClick(0.09);
    onKeyPress(key);
  };

  return (
    <div
      className={`bg-[#fff8f8] rounded-3xl border border-[#f2d6d6] shadow-[0_18px_40px_rgba(0,0,0,0.08)] p-4 ${className ?? ""}`}
    >
      <div className="space-y-3">
        {rows.map((row, rowIndex) => (
          <div
            key={`${rowIndex}-${row.join("")}`}
            className="flex justify-center gap-2 sm:gap-3"
          >
            {row.map((key) => {
              const isWide = key === "backspace" || key === "clear";
              const isSpecial = key === "backspace" || key === "clear";

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleClick(key)}
                  className={[
                    "min-h-14 select-none rounded-2xl font-bold uppercase transition-transform active:scale-95",
                    "bg-[#b91c1c] text-white shadow-md hover:bg-[#991414]",
                    isWide
                      ? "px-5 text-sm sm:text-base"
                      : "w-12 sm:w-14 text-lg sm:text-xl",
                    isSpecial
                      ? "flex items-center justify-center gap-2 px-4"
                      : "",
                  ].join(" ")}
                  aria-label={
                    key === "backspace"
                      ? "Apagar"
                      : key === "clear"
                        ? "Limpar"
                        : key === "@"
                          ? "Arroba"
                          : key === "."
                            ? "Ponto"
                            : `Letra ${key}`
                  }
                >
                  {key === "backspace" ? (
                    <>
                      <Delete className="h-5 w-5" />
                      <span>Apagar</span>
                    </>
                  ) : key === "clear" ? (
                    <>
                      <RotateCcw className="h-5 w-5" />
                      <span>Limpar</span>
                    </>
                  ) : (
                    key
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailKeyboard;
