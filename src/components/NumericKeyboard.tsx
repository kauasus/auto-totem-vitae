import React from 'react';

interface NumericKeyboardProps {
  onKeyPress: (key: string) => void;
  className?: string;
}

const keys = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  '←', '0', '⌫',
];

const NumericKeyboard: React.FC<NumericKeyboardProps> = ({ onKeyPress, className }) => {
  const handleClick = (key: string) => {
    if (key === '←') {
      onKeyPress('backspace');
    } else if (key === '⌫') {
      onKeyPress('clear');
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 max-w-md mx-auto ${className ?? ''}`}>
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img src="/vitae.png" alt="Vitae Center Logo" className="h-16 object-contain" />
      </div>

      {/* Grid de teclas */}
      <div className="grid grid-cols-3 gap-4">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => handleClick(key)}
            className={`bg-[#b91c1c] text-white font-bold text-2xl rounded-lg shadow-md hover:bg-[#991414] active:scale-95 transition-transform py-5 select-none`}
            aria-label={key === '←' ? 'Voltar' : key === '⌫' ? 'Limpar' : `Número ${key}`}
            type="button"
          >
            {key === '←' ? '←' : key === '⌫' ? 'Limpar' : key}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumericKeyboard;