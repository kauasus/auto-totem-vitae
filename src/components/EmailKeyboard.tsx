import React from "react";
import { Delete, RotateCcw } from "lucide-react";
import { playClick } from "../utils/sounds";

interface EmailKeyboardProps {
  onKeyPress: (key: string) => void;
  onSuggestionPress?: (domain: string) => void;
  value?: string;
  className?: string;
  soundEnabled?: boolean;
}

const emailSuggestions = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "icloud.com",
  "live.com",
  "uol.com.br",
  "bol.com.br",
];

const rows = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m", ".", "@"],
  ["_", "-", "+", "backspace", "clear"],
];

const EmailKeyboard: React.FC<EmailKeyboardProps> = ({
  onKeyPress,
  onSuggestionPress,
  value = "",
  className,
  soundEnabled = true,
}) => {
  const normalizedValue = value.trim().toLowerCase();
  const hasLocalPart = normalizedValue.length > 0;
  const hasAtSign = normalizedValue.includes("@");

  const handleClick = (key: string) => {
    if (soundEnabled) playClick(0.09);
    onKeyPress(key);
  };

  const handleSuggestionClick = (domain: string) => {
    if (!onSuggestionPress || !hasLocalPart) return;
    if (soundEnabled) playClick(0.09);
    onSuggestionPress(domain);
  };

  return (
    <div
      className={`bg-[#fff8f8] rounded-3xl border border-[#f2d6d6] shadow-[0_18px_40px_rgba(0,0,0,0.08)] p-4 ${className ?? ""}`}
    >
      <div className="space-y-3">
        {onSuggestionPress && (
          <div className="rounded-2xl border border-dashed border-[#f2d6d6] bg-white/80 p-3">
            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">
              Sugestões rápidas
            </div>
            <div className="flex flex-wrap gap-2">
              {emailSuggestions.map((domain) => {
                const isActive = hasLocalPart;
                const label = `@${domain}`;

                return (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => handleSuggestionClick(domain)}
                    disabled={!isActive}
                    className={[
                      "rounded-full px-3 py-2 text-sm font-bold transition active:scale-95",
                      isActive
                        ? "bg-[#b91c1c] text-white hover:bg-[#991414]"
                        : "cursor-not-allowed bg-gray-100 text-gray-400",
                    ].join(" ")}
                    aria-label={`Preencher domínio ${label}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {!hasAtSign && (
              <p className="mt-2 text-[11px] text-gray-500">
                Digite o nome e toque em um domínio para completar.
              </p>
            )}
          </div>
        )}

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
