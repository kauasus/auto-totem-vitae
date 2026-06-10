import React from 'react';
import { Delete, RotateCcw } from 'lucide-react';
import { playClick } from '../utils/sounds';

interface TextKeyboardProps {
  onKeyPress: (key: string) => void;
  className?: string;
  soundEnabled?: boolean;
}

const alphaRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const specialRow = ['space', '.', ',', '-', '/', 'backspace', 'clear'];

const TextKeyboard: React.FC<TextKeyboardProps> = ({ onKeyPress, className, soundEnabled = true }) => {
  const handleClick = (key: string) => {
    if (soundEnabled) playClick(0.09);
    onKeyPress(key);
  };

  return (
    <div
      className={`bg-[#fff8f8] rounded-3xl border border-[#f2d6d6] shadow-[0_18px_40px_rgba(0,0,0,0.08)] p-4 ${className ?? ''}`}
    >
      <div className="space-y-3">
        {alphaRows.map((row, rowIndex) => (
          <div key={`${rowIndex}-${row.join('')}`} className="flex justify-center gap-2 sm:gap-3">
            {row.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleClick(key)}
                className="min-h-14 w-12 sm:w-14 select-none rounded-2xl bg-[#b91c1c] px-2 text-lg sm:text-xl font-black text-white shadow-md transition-transform hover:bg-[#991414] active:scale-95"
                aria-label={`Letra ${key}`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}

        <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
          {specialRow.map((key) => {
            const isAction = key === 'backspace' || key === 'clear';
            const isSpace = key === 'space';

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleClick(key)}
                className={[
                  'min-h-14 select-none rounded-2xl font-black uppercase transition-transform active:scale-95',
                  'bg-[#b91c1c] text-white shadow-md hover:bg-[#991414]',
                  isSpace ? 'px-8 text-sm sm:text-base min-w-28' : 'px-5 text-sm sm:text-base',
                  isAction ? 'flex items-center justify-center gap-2 px-4' : '',
                ].join(' ')}
                aria-label={
                  key === 'space' ? 'Espaço' : key === 'backspace' ? 'Apagar' : key === 'clear' ? 'Limpar' : key
                }
              >
                {key === 'space' ? (
                  'Espaço'
                ) : key === 'backspace' ? (
                  <>
                    <Delete className="h-5 w-5" />
                    <span>Apagar</span>
                  </>
                ) : key === 'clear' ? (
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
      </div>
    </div>
  );
};

export default TextKeyboard;
