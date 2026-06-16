import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';
import NumericKeyboard from './NumericKeyboard';
import TextKeyboard from './TextKeyboard';
import { playClick } from '../utils/sounds';

type KeyboardKind = 'text' | 'numeric';

interface FieldKeyboardModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  value: string;
  keyboardKind: KeyboardKind;
  placeholder?: string;
  maxLength?: number;
  previewFormatter?: (value: string) => string;
  onClose: () => void;
  onConfirm: (value: string) => void;
}

const FieldKeyboardModal: React.FC<FieldKeyboardModalProps> = ({
  open,
  title,
  subtitle,
  value,
  keyboardKind,
  placeholder = 'Digite aqui',
  maxLength,
  previewFormatter,
  onClose,
  onConfirm,
}) => {
  const [draft, setDraft] = useState(value);

  const previewValue = previewFormatter ? previewFormatter(draft) : draft;

  const handleKeyPress = (key: string) => {
    setDraft((current) => {
      if (key === 'backspace') return current.slice(0, -1);
      if (key === 'clear') return '';

      const nextChar = key === 'space' ? ' ' : key;
      const nextValue = `${current}${nextChar}`;

      if (maxLength && nextValue.length > maxLength) return current;
      return nextValue;
    });
  };

  const handleConfirm = () => {
    playClick(0.08);
    onConfirm(draft);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1150] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/40 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
            initial={{ y: 30, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="bg-gradient-to-r from-[#b91c1c] to-[#8b1212] px-6 py-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/80">Editar campo</p>
                  <h3 className="mt-1 text-2xl font-black uppercase tracking-tight">{title}</h3>
                  {subtitle && <p className="mt-2 max-w-2xl text-sm text-white/90">{subtitle}</p>}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-white/15 p-3 transition hover:bg-white/25"
                  aria-label="Fechar teclado"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-5 bg-[#fffdfd] p-6 md:p-8">
              <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Valor digitado</span>
                  <span className="rounded-full bg-[#fef2f2] px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[#b91c1c]">
                    {keyboardKind === 'numeric' ? 'Numérico' : 'Texto'}
                  </span>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-2xl font-semibold tracking-tight text-gray-800 break-all">
                  {previewValue || placeholder}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Keyboard className="h-4 w-4" />
                <span>Toque nas teclas para preencher o campo e confirme no fim.</span>
              </div>

              {keyboardKind === 'numeric' ? (
                <NumericKeyboard onKeyPress={handleKeyPress} />
              ) : (
                <TextKeyboard onKeyPress={handleKeyPress} />
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl bg-gray-100 px-6 py-4 text-lg font-bold text-gray-700 transition hover:bg-gray-200"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  className="rounded-2xl bg-[#b91c1c] px-8 py-4 text-lg font-black uppercase tracking-wide text-white shadow-lg transition hover:bg-[#991414] active:scale-95"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FieldKeyboardModal;
