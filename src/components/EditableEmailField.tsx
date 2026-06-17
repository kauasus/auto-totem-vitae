/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AtSign, CheckCircle2, Keyboard, Mail, X } from "lucide-react";
import EmailKeyboard from "./EmailKeyboard";
import { isValidEmail, normalizeEmail } from "../utils/validation";
import { playClick } from "../utils/sounds";

interface EditableEmailFieldProps {
  value: string;
  onChange: (email: string) => void;
}

const EditableEmailField: React.FC<EditableEmailFieldProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) setDraft(value);
  }, [isOpen, value]);

  const openEditor = () => {
    setDraft(value);
    setError(null);
    setIsOpen(true);
    playClick(0.08);
  };

  const closeEditor = () => {
    setIsOpen(false);
    setError(null);
  };

  const commitDraft = () => {
    const nextEmail = normalizeEmail(draft);
    if (!isValidEmail(nextEmail)) {
      setError("Digite um e-mail válido para continuar.");
      return;
    }

    onChange(nextEmail);
    closeEditor();
  };

  const handleKeyPress = (key: string) => {
    setError(null);

    setDraft((current) => {
      if (key === "backspace") return current.slice(0, -1);
      if (key === "clear") return "";

      const nextChar = key.length === 1 ? key.toLowerCase() : key;
      return `${current}${nextChar}`;
    });
  };

  const handleSuggestionPress = (domain: string) => {
    setError(null);

    setDraft((current) => {
      const normalized = normalizeEmail(current);
      const [localPart] = normalized.split("@");
      if (!localPart) return current;
      return `${localPart}@${domain}`;
    });
  };

  const currentValue = value.trim();
  const isCurrentValid = isValidEmail(currentValue);

  return (
    <>
      <button
        type="button"
        onClick={openEditor}
        className={[
          "w-full text-left rounded-2xl border p-4 transition-all shadow-sm",
          isCurrentValid
            ? "border-gray-200 bg-white hover:border-[#b91c1c] hover:shadow-md"
            : "border-amber-300 bg-amber-50 hover:border-amber-400 hover:shadow-md",
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          <div
            className={[
              "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
              isCurrentValid
                ? "bg-[#fef2f2] text-[#b91c1c]"
                : "bg-amber-100 text-amber-700",
            ].join(" ")}
          >
            <Mail className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase font-bold text-gray-400 tracking-widest">
                E-mail
              </span>
              <span className="rounded-full bg-[#fef2f2] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#b91c1c]">
                Obrigatório
              </span>
            </div>
            <div className="mt-1 break-all text-lg font-semibold text-gray-800">
              {currentValue || "Toque para informar o e-mail"}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              {isCurrentValid ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>E-mail válido para prosseguir</span>
                </>
              ) : (
                <>
                  <AtSign className="h-4 w-4 text-amber-600" />
                  <span>Toque para editar e validar o endereço</span>
                </>
              )}
            </div>
          </div>

          <Keyboard className="mt-1 h-5 w-5 text-gray-400" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/40 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
              initial={{ y: 30, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="bg-gradient-to-r from-[#b91c1c] to-[#8b1212] px-6 py-5 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/80">
                      Contato
                    </p>
                    <h3 className="mt-1 text-2xl font-black uppercase tracking-tight">
                      Digite o e-mail
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm text-white/90">
                      Esse e-mail precisa estar válido antes de seguir para a
                      próxima etapa.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeEditor}
                    className="rounded-full bg-white/15 p-3 transition hover:bg-white/25"
                    aria-label="Fechar teclado de e-mail"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-5 bg-[#fffdfd] p-6 md:p-8">
                <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      E-mail digitado
                    </span>
                    <span
                      className={[
                        "rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em]",
                        isValidEmail(normalizeEmail(draft))
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700",
                      ].join(" ")}
                    >
                      {isValidEmail(normalizeEmail(draft))
                        ? "Válido"
                        : "Incompleto"}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-2xl font-semibold tracking-tight text-gray-800 break-all">
                    {draft || "Digite aqui com o teclado"}
                  </div>

                  {error && (
                    <p className="mt-3 text-sm font-semibold text-red-600">
                      {error}
                    </p>
                  )}
                </div>

                <EmailKeyboard
                  value={draft}
                  onKeyPress={handleKeyPress}
                  onSuggestionPress={handleSuggestionPress}
                />

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={closeEditor}
                    className="rounded-2xl bg-gray-100 px-6 py-4 text-lg font-bold text-gray-700 transition hover:bg-gray-200"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={commitDraft}
                    className="rounded-2xl bg-[#b91c1c] px-8 py-4 text-lg font-black uppercase tracking-wide text-white shadow-lg transition hover:bg-[#991414] active:scale-95"
                  >
                    Confirmar e-mail
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EditableEmailField;
